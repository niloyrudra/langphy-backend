import uuid
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.whisper_service import whisper_service
from app.services.nlp_client import evaluate_text
from app.services.audio_utils import normalize_audio
from app.services.scoring import word_confidence

router = APIRouter()

@router.post("/api/speech/evaluate")
async def evaluate_speech(
    audio: UploadFile = File(...),
    expected_text: str = Form(...)
):
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

        # 4️⃣ Flatten all segments' words
        words_with_conf = []
        for segment in transcription["segments"]:
            for w in segment.get("words", []):  # word timestamps from Whisper
                words_with_conf.append({
                    "text": w["word"],
                    "confidence": word_confidence(w.get("probability", 0))  # use logprob or probability
                })

        if not text:
            return {
                "error": "No speech detected",
                "transcription": "",
                "segments": [],
                "analysis": None
            }

        # 5️⃣ NLP evaluation
        nlp_result = await evaluate_text(
            expected=expected_text,
            spoken=text
        )

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
            "detail": str(e)
        }

    finally:
        # 🧹 Always clean temp files
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        if wav_path and os.path.exists(wav_path):
            os.remove(wav_path)

# import uuid
# import os
# from fastapi import APIRouter, UploadFile, File, Form, HTTPException
# from app.services.whisper_service import whisper_service
# from app.services.nlp_client import evaluate_text
# from app.services.audio_utils import normalize_audio

# router = APIRouter()

# @router.post("/api/speech/evaluate")
# async def evaluate_speech(
#     audio: UploadFile = File(...),
#     expected_text: str = Form(...)
# ):
#     tmp_path = f"/tmp/{uuid.uuid4()}.m4a" # wav

#     with open(tmp_path, "wb") as f:
#         f.write(await audio.read())

#     # after saving tmp_path
#     wav_path = normalize_audio(tmp_path)

#     # 1️⃣ Transcribe
#     transcription = whisper_service.transcribe(wav_path)

#     os.remove(tmp_path)
#     os.remove(wav_path)

#     # 2️⃣ NLP evaluation
#     nlp_result = await evaluate_text(
#         expected=expected_text,
#         spoken=transcription["text"]
#     )

#     # 3️⃣ Combine response
#     return {
#         "transcription": transcription["text"],
#         "segments": transcription["segments"],
#         "analysis": nlp_result
#     }