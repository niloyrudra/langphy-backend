def word_confidence( prob: float ) -> str:
    if prob > 0.85:
        return "good"
    if prob > 0.65:
        return "ok"
    return "bad"