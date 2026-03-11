"""
app/worker.py

RQ worker entry point for the speech-worker pod.

WHY THE WORKER ALSO NEEDS WARM-UP
----------------------------------
The speech-worker pod runs separately from the speech-api pod.  Each pod
is its own Python process and its own model instance.  The same 60-second
cold-start penalty applies here.

We solve it the same way: load_model() runs before the RQ worker loop
begins accepting jobs.  By the time the first job arrives from the queue,
the model is already warm.

HOW TO RUN
----------
  Direct:   python app/worker.py
  Via rq:   rq worker speech          ← used in Dockerfile/K8s (see below)

The Kubernetes deployment uses `rq worker speech` directly (the CMD in
speech-worker-depl.yaml).  For that case, warm-up happens via the
RQ worker `init_func` hook, NOT by running this file as __main__.
Set the RQ_WORKER_INIT env var to trigger the hook path.

Either way, load_model() is idempotent – calling it twice is safe.
"""

import logging
import os
import sys

import redis
from rq import Worker, Queue

from app.model import load_model

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)

REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
QUEUE_NAME = "speech"


def _get_redis() -> redis.Redis:
    return redis.Redis(host=REDIS_HOST, port=REDIS_PORT)


def boot_worker():
    """
    1. Load + warm the Whisper model  (eliminates 60s cold-start on first job)
    2. Start the RQ Worker loop

    Uses the modern RQ API (>=1.16): Connection context manager was removed;
    pass the Redis connection directly to Worker() instead.
    """
    logger.info("=== Speech worker starting: warming Whisper model before accepting jobs ===")
    load_model()
    logger.info("=== Model warm. Connecting to Redis at %s:%s ===", REDIS_HOST, REDIS_PORT)

    conn = _get_redis()

    # Modern API: no `with Connection(conn)` wrapper needed.
    # Pass conn directly to both Queue and Worker.
    queues = [Queue(QUEUE_NAME, connection=conn)]
    worker = Worker(queues, connection=conn)
    worker.work(with_scheduler=False)


if __name__ == "__main__":
    boot_worker()


# def warmup_hook():
#     """
#     RQ worker initialisation hook.

#     When you run `rq worker speech` (as configured in the K8s deployment),
#     RQ does not call boot_worker().  Instead, point RQ at this function via
#     the --worker-class flag or by subclassing Worker.

#     The simplest production approach: use the CustomWorker below, which
#     overrides perform_job to ensure the model is loaded before the first
#     job runs.  This covers both `python app/worker.py` and `rq worker speech`.
#     """
#     logger.info("warmup_hook: loading model for rq worker process")
#     load_model()


# class WarmWorker(Worker):
#     """
#     RQ Worker subclass that loads the Whisper model before processing
#     any job, regardless of how the worker process was started.

#     Usage in Kubernetes (speech-worker-depl.yaml):
#         command: ["rq"]
#         args: ["worker", "speech", "--worker-class", "app.worker.WarmWorker"]
#     """

#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         logger.info("WarmWorker.__init__: loading and warming Whisper model …")
#         load_model()
#         logger.info("WarmWorker.__init__: model ready, worker will now accept jobs")


# if __name__ == "__main__":
#     boot_worker()


# import os
# import redis
# from rq import Worker, Queue

# REDIS_HOST = os.getenv("REDIS_HOST", "redis")
# REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

# # Connect to Redis
# redis_conn = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)

# # Create the queue
# queue = Queue("speech", connection=redis_conn)

# if __name__ == "__main__":
#     # Create and start the worker
#     worker = Worker([queue], connection=redis_conn)
#     worker.work()