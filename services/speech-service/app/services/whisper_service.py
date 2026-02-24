from faster_whisper import WhisperModel

class WhisperService:
    def __init__(self):
        # INT8 = 2-4x faster on CPU
        self.model = WhisperModel(
            "small",
            device="cpu",
            compute_type="int8",
            cpu_threads=4  # adjust to your pod limit
        )

    def transcribe(self, audio_path: str) -> dict:
        segments, info = self.model.transcribe(
            audio_path,
            # fp16=False,
            language="de",
            # task="transcribe",
            word_timestamps=True,
            beam_size=1,            # lower = faster
            best_of=1,
            vad_filter=True         # skip silence
            # verbose=False
        )

        result_segments = []

        for segment in segments :
            result_segments.append({
                "start": segment.start,
                "end": segment.end,
                "text": segment.text.strip(),
                "words": [
                    {
                        "word": w.word,
                        "start": w.start,
                        "end": w.end,
                        "probability": w.probability
                    }
                    for w in segment.words or []
                ]
            })

        return {
            "text": " ".join(s["text"] for s in result_segments),
            "segments": result_segments
        }

whisper_service = WhisperService()

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