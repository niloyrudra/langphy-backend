import whisper

class WhisperService:
    def __init__(self):
        self.model = whisper.load_model("small")

    def transcribe(self, audio_path: str) -> dict:
        result = self.model.transcribe(
            audio_path,
            language="de",
            task="transcribe",
            word_timestamp=True,
            verbose=False
        )
        return {
            "text": result["text"].strip(),
            "segments": result["segments"]
        }


whisper_service = WhisperService()