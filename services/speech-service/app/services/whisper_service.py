# from faster_whisper import WhisperModel
# from app.model import get_model

"""
app/services/whisper_service.py

WHAT CHANGED FROM YOUR VERSION
────────────────────────────────
Your original instantiated WhisperModel("small", ...) at the bottom of this
file as a module-level singleton:

    whisper_service = WhisperService()   ← triggers full model load on import

This caused two problems:

1. DOUBLE MODEL: app/model.py also manages a WhisperModel singleton and runs
   the warm-up inference. Your worker.py called load_model() from app/model.py
   to warm up — but speech_job.py imported whisper_service from HERE, which
   has its own completely separate, never-warmed WhisperModel instance.
   The warm-up was heating the wrong model. The actual transcription job
   always ran on a cold model.

2. IMPORT-TIME LOAD: Any file that imported whisper_service triggered a full
   600 MB model load as a side effect, including in contexts where you did not
   want it (e.g., during FastAPI startup before lifespan ran).

FIX: WhisperService.transcribe() now calls get_model() from app/model.py.
There is one model instance in the process, loaded and warmed once by
load_model() at startup. whisper_service = WhisperService() is now a
trivial object with no side effects on import.
"""

from app.model import get_model


class WhisperService:
    """
    Thin wrapper around the shared Faster-Whisper model singleton.

    Instantiating this class is free — no model is loaded here.
    The model is loaded once by load_model() in the lifespan (API pod)
    or boot_worker() (worker pod), and retrieved via get_model().
    """

    def transcribe(self, audio_path: str) -> dict:
        """
        Transcribe a WAV file (16 kHz mono) and return text + word-level segments.

        Uses the already-warm model from app/model.py — no cold-start cost.
        """
        model = get_model()  # ← O(1) lookup, never triggers a load

        segments_gen, _ = model.transcribe(
            audio_path,
            language="de",
            word_timestamps=True,
            beam_size=1,    # fast; increase to 5 for higher accuracy
            best_of=1,
            vad_filter=True,
        )

        result_segments = []
        for segment in segments_gen:
            result_segments.append({
                "start": segment.start,
                "end": segment.end,
                "text": segment.text.strip(),
                "words": [
                    {
                        "word":        w.word,
                        "start":       w.start,
                        "end":         w.end,
                        "probability": w.probability,
                    }
                    for w in (segment.words or [])
                ],
            })

        return {
            "text":     " ".join(s["text"] for s in result_segments),
            "segments": result_segments,
        }


# Instantiation is now free — no model load happens here.
whisper_service = WhisperService()

# class WhisperService:
#     def __init__(self):
#         # INT8 = 2-4x faster on CPU
#         self.model = WhisperModel(
#             "small",
#             device="cpu",
#             compute_type="int8",
#             cpu_threads=4  # adjust to your pod limit
#         )

#     def transcribe(self, audio_path: str) -> dict:
#         segments, info = self.model.transcribe(
#             audio_path,
#             # fp16=False,
#             language="de",
#             # task="transcribe",
#             word_timestamps=True,
#             beam_size=1,            # lower = faster
#             best_of=1,
#             vad_filter=True         # skip silence
#             # verbose=False
#         )

#         result_segments = []

#         for segment in segments :
#             result_segments.append({
#                 "start": segment.start,
#                 "end": segment.end,
#                 "text": segment.text.strip(),
#                 "words": [
#                     {
#                         "word": w.word,
#                         "start": w.start,
#                         "end": w.end,
#                         "probability": w.probability
#                     }
#                     for w in segment.words or []
#                 ]
#             })

#         return {
#             "text": " ".join(s["text"] for s in result_segments),
#             "segments": result_segments
#         }

# whisper_service = WhisperService()

# import whisper

# class WhisperService:
#     def __init__(self):
#         self.model = whisper.load_model("small", device="cpu")

#     def transcribe(self, audio_path: str) -> dict:
#         result = self.model.transcribe(
#             audio_path,
#             fp16=False,
#             language="de",
#             task="transcribe",
#             word_timestamps=True,
#             verbose=False
#         )
#         return {
#             "text": result["text"].strip(),
#             "segments": result["segments"]
#         }

# whisper_service = WhisperService()

# import soundfile as sf
# import numpy as np
# import uuid
# import os
# import whisper

# class WhisperService:
#     def __init__(self):
#         self.model = None

#     def get_model(self):
#         if self.model is None:
#             self.model = whisper.load_model("small", device="cpu")
#         return self.model

#     def preprocess_audio(self, audio_path: str) -> str:
#         data, sr = sf.read(audio_path)

#         # Convert to mono
#         if len(data.shape) > 1:
#             data = np.mean(data, axis=1)

#         # Resample to 16kHz if needed
#         if sr != 16000:
#             import librosa
#             data = librosa.resample(data, orig_sr=sr, target_sr=16000)

#         tmp_path = f"/tmp/{uuid.uuid4().hex}_16k.wav"
#         sf.write(tmp_path, data, 16000, subtype="PCM_16")
#         return tmp_path

#     def transcribe(self, audio_path: str) -> dict:
#         wav_path = self.preprocess_audio(audio_path)

#         model = self.get_model()
#         result = model.transcribe(
#             wav_path,
#             fp16=False,
#             language="de",
#             task="transcribe",
#             word_timestamps=True,
#             verbose=False
#         )

#         os.remove(wav_path)
#         return {
#             "text": result["text"].strip(),
#             "segments": result["segments"]
#         }
    
# whisper_service = WhisperService()

# import whisper
# import torchaudio
# import uuid
# import os
# # import soundfile as sk

# # torchaudio.set_audio_backend("soundfile")

# class WhisperService:
#     def __init__(self):
#         self.model = None

#     def get_model(self):
#         if self.model is None:
#             print("[speech] starting whisper inference", flush=True)
#             self.model = whisper.load_model("small", device="cpu")
#         return self.model

#     def preprocess_audio(self, audio_path: str, output_path: str) -> str:

#         print(f"[speech] loading audio: {audio_path}", flush=True)
#         waveform, sr = torchaudio.load(audio_path)

#         # Convert to mono
#         waveform = waveform.mean(dim=0, keepdim=True)
#         # Resample to 16kHz
#         if sr != 16000:
#             waveform = torchaudio.transforms.Resample(orig_freq=sr, new_freq=16000)(waveform)
#         # Save as 16-bit PCM WAV
#         torchaudio.save(output_path, waveform, 16000, encoding="PCM_S", bits_per_sample=16)
#         return output_path

#     def transcribe(self, audio_path: str) -> dict:
#         # preprocessed_path = self.preprocess_audio(audio_path, "temp_16k_mono.wav")
#         tmp_path = f"/tmp/{uuid.uuid4().hex}.wav"
#         preprocessed_path = self.preprocess_audio(audio_path, tmp_path)

#         model = self.get_model()

#         result = model.transcribe(
#             preprocessed_path,
#             fp16=False,
#             language="de",
#             task="transcribe",
#             word_timestamps=True,
#             verbose=False
#         )
#         return {"text": result["text"].strip(), "segments": result["segments"]}

# whisper_service = WhisperService()


# from faster_whisper import WhisperModel

# class WhisperService:
#     def __init__(self):
#         self.model = WhisperModel(
#             "small",
#             device="cpu",          # or "cuda"
#             compute_type="int8"    # faster & lighter
#         )

#     def transcribe(self, audio_path: str) -> dict:
#         segments, info = self.model.transcribe(
#             audio_path,
#             language="de",
#             word_timestamps=True
#         )

#         result_segments = []

#         for segment in segments:
#             result_segments.append({
#                 "start": segment.start,
#                 "end": segment.end,
#                 "text": segment.text.strip(),
#                 "words": [
#                     {
#                         "word": w.word,
#                         "start": w.start,
#                         "end": w.end,
#                         "probability": w.probability
#                     }
#                     for w in segment.words or []
#                 ]
#             })

#         return {
#             "text": " ".join(s["text"] for s in result_segments),
#             "segments": result_segments
#         }


# whisper_service = WhisperService()