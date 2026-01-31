import uuid
import os
import unicodedata
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from app.services.whisper_service import whisper_service
from app.services.nlp_client import evaluate_text
from app.services.audio_utils import normalize_audio
from app.services.scoring import word_confidence

router = APIRouter()

def normalize_text(s: str) -> str:
    """Trim and normalize text for NLP evaluation"""
    return unicodedata.normalize("NFC", s.strip())

@router.post("/api/speech/evaluate")
async def evaluate_speech(
    # background_tasks: BackgroundTasks,
    audio: UploadFile = File(...),
    expected_text: str = Form(...)
):
    
    job_id = str(uuid.uuid4())

    if not audio.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid audio file")

    tmp_path = f"/tmp/{uuid.uuid4()}.m4a"
    wav_path = None

    try:
        # 1️⃣ Save audio
        with open(tmp_path, "wb") as f:
            f.write(await audio.read())

        # 2️⃣ Normalize
        wav_path = normalize_audio(tmp_path)

        # 3️⃣ Transcribe
        transcription = whisper_service.transcribe(wav_path)

        text = transcription.get("text", "").strip()
        segments = transcription.get("segments", [])

        if not text:
            return {
                "error": "No speech detected",
                "transcription": "",
                "segments": [],
                "words": [],
                "analysis": None
            }

        # 4️⃣ NLP evaluation
        expected_text_clean = expected_text.strip()
        spoken_clean = text.strip()
        expected_clean = normalize_text(expected_text_clean)
        nlp_result = await evaluate_text(
            expected=expected_clean,
            spoken=spoken_clean
        )

        # 5️⃣ Flatten all segments' words
        words_with_conf = []
        for segment in transcription["segments"]:
            for w in segment.get("words", []):  # word timestamps from Whisper
                words_with_conf.append({
                    "text": w["word"].strip(),
                    "confidence": word_confidence(w.get("probability", 0))  # use logprob or probability
                })

        # 5️ Final response
        return {
            "transcription": text,
            "segments": segments,
            "words": words_with_conf,
            "analysis": nlp_result
        }

    except Exception as e:
        # 🔒 NEVER crash Expo
        return {
            "error": "Speech evaluation failed",
            "detail": str(e),
            "transcription": transcription.get("text", ""),
            "segments": segments if 'segments' in locals() else [],
            "words": words_with_conf if 'words_with_conf' in locals() else [],
            "analysis": {}
        }

    finally:
        # 🧹 Always clean temp files
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        if wav_path and os.path.exists(wav_path):
            os.remove(wav_path)


# @router.get("/api/speech/result/{job_id}")
# async def get_result(job_id: str):
#     if job_id not in JOB_RESULTS:
#         return {"status": "processing"}

#     return {
#         "status": "done",
#         "data": JOB_RESULTS[job_id]
#     }