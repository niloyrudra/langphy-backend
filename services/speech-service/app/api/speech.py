import json
import uuid
import os
import unicodedata
from redis import Redis
from rq import Queue
import app.state as state

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.jobs.speech_job import process_job

router = APIRouter()

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")

redis_client = Redis(
    host=REDIS_HOST,
    port=6379,
    db=0,
    decode_responses=True
)

redis_conn = Redis(host=REDIS_HOST, port=6379)
queue = Queue("speech", connection=redis_conn)

# --------------------------------------------------
# Utilities
# --------------------------------------------------

def normalize_text(s: str) -> str:
    return unicodedata.normalize("NFC", s.strip())

def set_job(job_id, data):
    redis_client.setex(
        f"speech:{job_id}",
        600,  # auto expire in 10 min
        json.dumps(data)
    )

def get_job(job_id):
    result = redis_client.get(f"speech:{job_id}")
    return json.loads(result) if result else None

# --------------------------------------------------
# Routes
# --------------------------------------------------

@router.post("/api/speech/evaluate")
async def evaluate_speech(
    audio: UploadFile = File(...),
    expected_text: str = Form(...)
):
    if not audio.content_type or not audio.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid audio file")

    job_id = str(uuid.uuid4())
    tmp_path = f"/tmp/{job_id}.m4a"

    try:
        with open(tmp_path, "wb") as f:
            f.write(await audio.read())
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to save audio")

    set_job(job_id, {"status": "processing"})

    # 🔥 ENQUEUE JOB IN RQ
    queue.enqueue(
        process_job,
        job_id,
        tmp_path,
        expected_text,
        job_id=job_id
    )

    return {
        "job_id": job_id,
        "status": "processing"
    }


@router.get("/api/speech/result/{job_id}")
async def get_result(job_id: str):
    job = get_job(job_id)

    if not job:
        return {"status": "not_found"}

    print("Returning job:", job)

    return job


# ── Health endpoints ───────────────────────────────────────────────────────────

@router.get("/health/live", tags=["Health"])
def liveness():
    """
    Kubernetes livenessProbe target.
    Returns 200 as long as the process is running.
    No model check – if the process is alive, it is live.
    """
    return {"status": "alive"}


@router.get("/health/ready", tags=["Health"])
def readiness():
    """
    Kubernetes readinessProbe target.
    Returns 200 only after load_model() has completed.
    Kubernetes will not route traffic here until this endpoint succeeds.
    """
    if not state.is_ready(): # _ready:
        raise HTTPException(status_code=503, detail="Model not yet loaded")
    return {"status": "ready"}