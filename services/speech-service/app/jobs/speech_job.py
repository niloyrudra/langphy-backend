import os
import asyncio
import unicodedata
import json
import logging

import redis

logger = logging.getLogger(__name__)


def _get_redis() -> redis.Redis:
    return redis.Redis(
        host=os.getenv("REDIS_HOST", "redis"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        db=0,
        decode_responses=True,
    )


def normalize_text(s: str) -> str:
    return unicodedata.normalize("NFC", s.strip())


def set_job(job_id: str, data: dict) -> None:
    _get_redis().setex(
        f"speech:{job_id}",
        600,
        json.dumps(data),
    )


# def _transcribe(wav_path: str) -> dict:
#     """
#     Load a FRESH WhisperModel inside the forked RQ job process and transcribe.

#     WHY A FRESH MODEL INSTEAD OF THE SINGLETON:
#     RQ forks the worker process for each job. The forked child inherits the
#     parent's CTranslate2 thread pool. On Docker Desktop for Windows, that
#     inherited thread pool deadlocks during inference — the threads wait on
#     synchronisation primitives that belong to the parent process and never
#     wake up. This causes Whisper to hang indefinitely with no error or log.

#     Loading a brand-new WhisperModel() inside the forked child creates a
#     clean thread pool owned by this process. No inheritance, no deadlock.

#     The model weights are already on disk (baked into the image), so loading
#     takes ~2-3 seconds — not the 60-second download penalty.
#     """
#     from faster_whisper import WhisperModel

#     model_size   = os.getenv("WHISPER_MODEL_SIZE",  "small")
#     device       = os.getenv("WHISPER_DEVICE",      "cpu")
#     compute_type = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
#     cache_dir    = os.getenv("HF_HOME", "/root/.cache/huggingface")

#     logger.info("[_transcribe] Loading fresh WhisperModel in forked process")
#     model = WhisperModel(
#         model_size,
#         device=device,
#         compute_type=compute_type,
#         download_root=cache_dir,
#     )

#     segments_gen, _ = model.transcribe(
#         wav_path,
#         language="de",
#         word_timestamps=True,
#         beam_size=1,
#         best_of=1,
#         vad_filter=False,
#     )

#     result_segments = []
#     for segment in segments_gen:
#         result_segments.append({
#             "start": segment.start,
#             "end":   segment.end,
#             "text":  segment.text.strip(),
#             "words": [
#                 {
#                     "word":        w.word,
#                     "start":       w.start,
#                     "end":         w.end,
#                     "probability": w.probability,
#                 }
#                 for w in (segment.words or [])
#             ],
#         })

#     return {
#         "text":     " ".join(s["text"] for s in result_segments),
#         "segments": result_segments,
#     }


def process_job(job_id: str, tmp_path: str, expected_text: str) -> None:
    """
    RQ job — runs in the SAME worker process (no fork).
    worker.work(fork_job_execution=False) ensures this.
 
    Because there is no fork, the pre-loaded WhisperModel singleton from
    app/model.py is safe to use directly — no thread pool inheritance,
    no deadlock, no SIGSEGV.
    """
    from app.services.whisper_service import whisper_service
    from app.services.nlp_client import evaluate_text
    from app.services.audio_utils import normalize_audio
    from app.services.scoring import word_confidence
 
    wav_path = None

    logger.info("[process_job] Starting job %s | expected: %r", job_id, expected_text)

    try:
        # Step 1: normalise audio
        logger.info("[process_job] Normalising audio: %s", tmp_path)
        wav_path = normalize_audio(tmp_path)
        logger.info("[process_job] Audio normalised: %s", wav_path)

        file_size = os.path.getsize(wav_path)
        if file_size < 16_000:
            set_job(job_id, {
                "status": "done",
                "data": {
                    "error": "Recording too short — please hold the button while speaking",
                    "transcription": "",
                    "segments": [],
                    "words": [],
                    "analysis": None,
                }
            })
            return

        # Step 2: transcribe with fresh model (no fork-inherited thread pool deadlock)
        logger.info("[process_job] Starting Whisper transcription")
        
        # transcription = _transcribe(wav_path)
        transcription = whisper_service.transcribe(wav_path)
        text = transcription.get("text", "").strip()
        
        logger.info("[process_job] Transcription result: %r", text)

        if not text:
            logger.warning("[process_job] No speech detected in audio")
            set_job(job_id, {
                "status": "done",
                "data": {
                    "error": "No speech detected",
                    "transcription": "",
                    "segments": [],
                    "words": [],
                    "analysis": None,
                },
            })
            return

        # Step 3: NLP evaluation
        expected_clean = normalize_text(expected_text)
        spoken_clean   = text.strip()
        logger.info("[process_job] Calling NLP service | expected=%r spoken=%r", expected_clean, spoken_clean)
        
        nlp_result = asyncio.run(evaluate_text(expected_clean, spoken_clean))
        
        logger.info("[process_job] NLP result: %s", json.dumps(nlp_result, ensure_ascii=False))

        # Step 4: word confidence scores
        words_with_conf = []
        for segment in transcription.get("segments", []):
            for w in segment.get("words", []):
                words_with_conf.append({
                    "text":       w.get("word", "").strip(),
                    "confidence": word_confidence(w.get("probability", 0)),
                })

        # Step 5: store result
        set_job(job_id, {
            "status": "done",
            "data": {
                "transcription": text,
                "segments":      transcription.get("segments", []),
                "words":         words_with_conf,
                "analysis":      nlp_result,
            },
        })
        logger.info("[process_job] Job %s complete", job_id)

    except Exception as e:
        logger.exception("[process_job] Job %s FAILED: %s", job_id, e)
        set_job(job_id, {
            "status": "done",
            "data": {
                "error":  "Speech evaluation failed",
                "detail": str(e),
            },
        })

    finally:
        for path in [tmp_path, wav_path]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except Exception:
                    pass






# import os
# import asyncio
# import unicodedata
# import json
# import logging

# import redis

# logger = logging.getLogger(__name__)

# # ── Redis helper ───────────────────────────────────────────────────────────────
# # Do NOT create a module-level Redis client here.
# # RQ forks the worker process for each job. A module-level Redis connection
# # created before the fork is in an undefined state inside the forked child.
# # Instead, create a fresh client inside each function that needs it.

# def _get_redis() -> redis.Redis:
#     return redis.Redis(
#         host=os.getenv("REDIS_HOST", "redis"),
#         port=int(os.getenv("REDIS_PORT", 6379)),
#         db=0,
#         decode_responses=True,
#     )


# def normalize_text(s: str) -> str:
#     return unicodedata.normalize("NFC", s.strip())


# def set_job(job_id: str, data: dict) -> None:
#     """Write job result to Redis. Creates a fresh connection each call."""
#     _get_redis().setex(
#         f"speech:{job_id}",
#         600,                    # expire in 10 minutes
#         json.dumps(data),
#     )


# def process_job(job_id: str, tmp_path: str, expected_text: str) -> None:
#     """
#     RQ job: transcribe audio, evaluate pronunciation, store result.

#     KEY FIXES vs previous version
#     ──────────────────────────────
#     1. asyncio.new_event_loop() replaced with asyncio.run().
#        new_event_loop() inside a forked RQ worker process is unreliable —
#        it can hang or silently fail depending on the OS fork state.
#        asyncio.run() creates a fresh event loop, runs the coroutine to
#        completion, and tears it down cleanly. It is the correct API for
#        running async code from synchronous context in Python 3.7+.

#     2. Redis client created fresh inside the function (not at module level).
#        Module-level clients are created before RQ forks the worker process.
#        The forked child inherits the parent's file descriptors in an
#        undefined state. A fresh client avoids stale socket issues.

#     3. Explicit logging at each stage so you can see exactly where a failure
#        occurs in `kubectl logs deployment/speech-worker-depl`.
#     """

#     from app.services.whisper_service import whisper_service
#     from app.services.nlp_client import evaluate_text
#     from app.services.audio_utils import normalize_audio
#     from app.services.scoring import word_confidence

#     wav_path = None

#     logger.info("[process_job] Starting job %s | expected: %r", job_id, expected_text)

#     try:
#         # ── Step 1: normalise audio to 16 kHz mono WAV ────────────────────
#         logger.info("[process_job] Normalising audio: %s", tmp_path)
#         wav_path = normalize_audio(tmp_path)
#         logger.info("[process_job] Audio normalised: %s", wav_path)

#         file_size = os.path.getsize(wav_path)
#         # 16kHz mono s16 = 32000 bytes/sec. Less than 0.5s = likely not real speech.
#         if file_size < 16_000:
#             set_job(job_id, {
#                 "status": "done",
#                 "data": {
#                     "error": "Recording too short — please hold the button while speaking",
#                     "transcription": "",
#                     "segments": [],
#                     "words": [],
#                     "analysis": None,
#                 }
#             })
#             return

#         # ── Step 2: transcribe ─────────────────────────────────────────────
#         logger.info("[process_job] Starting Whisper transcription")
#         transcription = whisper_service.transcribe(wav_path)
#         text = transcription.get("text", "").strip()
#         logger.info("[process_job] Transcription result: %r", text)

#         if not text:
#             logger.warning("[process_job] No speech detected in audio")
#             set_job(job_id, {
#                 "status": "done",
#                 "data": {
#                     "error": "No speech detected",
#                     "transcription": "",
#                     "segments": [],
#                     "words": [],
#                     "analysis": None,
#                 },
#             })
#             return

#         # ── Step 3: NLP evaluation ─────────────────────────────────────────
#         expected_clean = normalize_text(expected_text)
#         spoken_clean   = text.strip()

#         logger.info(
#             "[process_job] Calling NLP service | expected=%r spoken=%r",
#             expected_clean, spoken_clean,
#         )

#         # asyncio.run() is the correct way to call async code from a
#         # synchronous RQ job. It creates a brand-new event loop, runs the
#         # coroutine to completion, and closes the loop — no leaks, no
#         # fork-state issues.
#         nlp_result = asyncio.run(evaluate_text(expected_clean, spoken_clean))
#         logger.info("[process_job] NLP result: %s", json.dumps(nlp_result, ensure_ascii=False))

#         # ── Step 4: word confidence scores ────────────────────────────────
#         words_with_conf = []
#         for segment in transcription.get("segments", []):
#             for w in segment.get("words", []):
#                 words_with_conf.append({
#                     "text":       w.get("word", "").strip(),
#                     "confidence": word_confidence(w.get("probability", 0)),
#                 })

#         # ── Step 5: store result ───────────────────────────────────────────
#         set_job(job_id, {
#             "status": "done",
#             "data": {
#                 "transcription": text,
#                 "segments":      transcription.get("segments", []),
#                 "words":         words_with_conf,
#                 "analysis":      nlp_result,
#             },
#         })
#         logger.info("[process_job] Job %s complete", job_id)

#     except Exception as e:
#         # Log the full exception so it appears in kubectl logs
#         logger.exception("[process_job] Job %s FAILED: %s", job_id, e)
#         set_job(job_id, {
#             "status": "done",
#             "data": {
#                 "error":  "Speech evaluation failed",
#                 "detail": str(e),
#             },
#         })

#     finally:
#         # Always clean up temp files
#         for path in [tmp_path, wav_path]:
#             if path and os.path.exists(path):
#                 try:
#                     os.remove(path)
#                 except Exception:
#                     pass



# import os
# import asyncio
# import unicodedata
# import json
# import redis
# from app.services.nlp_client import evaluate_text_sync

# redis_client = redis.Redis(
#     host=os.getenv("REDIS_HOST", "localhost"),
#     port=6379,
#     db=0,
#     decode_responses=True
# )

# def normalize_text(s: str) -> str:
#     return unicodedata.normalize("NFC", s.strip())

# def set_job(job_id, data):
#     redis_client.setex(
#         f"speech:{job_id}",
#         600,
#         json.dumps(data)
#     )

# def process_job(job_id: str, tmp_path: str, expected_text: str):

#     from app.services.whisper_service import whisper_service
#     # from app.services.nlp_client import evaluate_text
#     from app.services.nlp_client import evaluate_text_sync
#     from app.services.audio_utils import normalize_audio
#     from app.services.scoring import word_confidence

#     wav_path = None

#     try:
#         wav_path = normalize_audio(tmp_path)

#         transcription = whisper_service.transcribe(wav_path)
#         text = transcription.get("text", "").strip()

#         if not text:
#             set_job(job_id, {
#                 "status": "done",
#                 "data": {
#                     "error": "No speech detected",
#                     "transcription": "",
#                     "segments": [],
#                     "words": [],
#                     "analysis": None
#                 }
#             })
#             return

#         expected_clean = normalize_text(expected_text)
#         spoken_clean = text.strip()

#         # loop = asyncio.new_event_loop()
#         # asyncio.set_event_loop(loop)
#         # nlp_result = loop.run_until_complete(
#         #     evaluate_text(expected_clean, spoken_clean)
#         # )
#         # loop.close()

#         nlp_result = evaluate_text_sync(expected_clean, spoken_clean)

#         words_with_conf = []
#         for segment in transcription.get("segments", []):
#             for w in segment.get("words", []):
#                 words_with_conf.append({
#                     "text": w.get("word", "").strip(),
#                     "confidence": word_confidence(
#                         w.get("probability", 0)
#                     )
#                 })

#         print("FINAL RESULT:", nlp_result)

#         set_job(job_id, {
#             "status": "done",
#             "data": {
#                 "transcription": text,
#                 "segments": transcription.get("segments", []),
#                 "words": words_with_conf,
#                 "analysis": nlp_result
#             }
#         })

#     except Exception as e:
#         set_job(job_id, {
#             "status": "done",
#             "data": {
#                 "error": "Speech evaluation failed",
#                 "detail": str(e)
#             }
#         })

#     finally:
#         try:
#             if os.path.exists(tmp_path):
#                 os.remove(tmp_path)
#         except:
#             pass

#         try:
#             if wav_path and os.path.exists(wav_path):
#                 os.remove(wav_path)
#         except:
#             pass