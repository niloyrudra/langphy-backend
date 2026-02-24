import os
import redis
from rq import Worker, Queue

REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

# Connect to Redis
redis_conn = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)

# Create the queue
queue = Queue("speech", connection=redis_conn)

if __name__ == "__main__":
    # Create and start the worker
    worker = Worker([queue], connection=redis_conn)
    worker.work()