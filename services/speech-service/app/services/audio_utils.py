import ffmpeg
import os

def normalize_audio(input_path: str) -> str:
    output_path = input_path.replace(".m4a", "_norm.wav")

    (
        ffmpeg
        .input(input_path)
        .output(
            output_path,
            ac=1,        # mono
            ar=16000,    # 16kHz
            format="wav"
        )
        .run(overwrite_output=True, quiet=True)
    )

    return output_path