import whisper

class WhisperService:
    def __init__(self):
        self.model = whisper.load_model("small")

    def transcribe(self, audio_path: str) -> dict:
        result = self.model.transcribe(
            audio_path,
            language="de",
            task="transcribe",
            word_timestamps=True,
            verbose=False
        )
        return {
            "text": result["text"].strip(),
            "segments": result["segments"]
        }

whisper_service = WhisperService()

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