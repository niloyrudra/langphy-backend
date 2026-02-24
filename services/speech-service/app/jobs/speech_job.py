import os
import asyncio
import unicodedata
import json
import redis

from app.services.whisper_service import whisper_service
from app.services.nlp_client import evaluate_text
from app.services.audio_utils import normalize_audio
from app.services.scoring import word_confidence

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=6379,
    db=0,
    decode_responses=True
)

def normalize_text(s: str) -> str:
    return unicodedata.normalize("NFC", s.strip())

def set_job(job_id, data):
    redis_client.setex(
        f"speech:{job_id}",
        600,
        json.dumps(data)
    )

def process_job(job_id: str, tmp_path: str, expected_text: str):
    wav_path = None

    try:
        wav_path = normalize_audio(tmp_path)

        transcription = whisper_service.transcribe(wav_path)
        text = transcription.get("text", "").strip()

        if not text:
            set_job(job_id, {
                "status": "done",
                "data": {
                    "error": "No speech detected",
                    "transcription": "",
                    "segments": [],
                    "words": [],
                    "analysis": None
                }
            })
            return

        expected_clean = normalize_text(expected_text)
        spoken_clean = text.strip()

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        nlp_result = loop.run_until_complete(
            evaluate_text(expected_clean, spoken_clean)
        )
        loop.close()

        words_with_conf = []
        for segment in transcription.get("segments", []):
            for w in segment.get("words", []):
                words_with_conf.append({
                    "text": w.get("word", "").strip(),
                    "confidence": word_confidence(
                        w.get("probability", 0)
                    )
                })

        set_job(job_id, {
            "status": "done",
            "data": {
                "transcription": text,
                "segments": transcription.get("segments", []),
                "words": words_with_conf,
                "analysis": nlp_result
            }
        })

    except Exception as e:
        set_job(job_id, {
            "status": "done",
            "data": {
                "error": "Speech evaluation failed",
                "detail": str(e)
            }
        })

    finally:
        try:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        except:
            pass

        try:
            if wav_path and os.path.exists(wav_path):
                os.remove(wav_path)
        except:
            pass