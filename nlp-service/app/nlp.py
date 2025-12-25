import spacy

nlp = spacy.load("de_core_news_lg")

CASE_COLORS = {
    "Nom": "#4CAF50",
    "Acc": "#FF9800",
    "Dat": "#2196F3",
    "Gen": "#9C27B0"
}

def analyze_text(text: str):
    doc = nlp(text)

    tokens = []
    for token in doc:
        morph = token.morph.to_dict()
        case = morph.get("Case")

        tokens.append({
            "text": token.text,
            "lemma": token.lemma_,
            "pos": token.pos_,
            "dep": token.dep_,
            "case": case,
            "color": CASE_COLORS.get(case)
        })

    return {
        "text": text,
        "tokens": tokens
    }

def analyze_lesson(text: str):
    doc = nlp(text)

    tokens = []
    for token in doc:
        tokens.append({
            "text": token.text,
            "pos": token.pos_,
            "tag": token.tag_,
            "dep": token.dep_,
            "lemma": token.lemma_,
            "is_stop": token.is_stop
        })

    return {
        "language": "de",
        "tokens": tokens
    }

def analyze_answer(expected: str, user_answer: str):
    expected_ans = nlp(expected)
    ans = nlp(user_answer)

    similarity = expected_ans.similarity(ans)

    return {
        "similarity": round(similarity, 2),
        "feedback": (
            "Excellent" if similarity > 0.85 else
            "Good" if similarity > 0.65 else
            "Needs improvement"
        )
    }