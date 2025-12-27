def default_article(gender, number):
    if number == "Plur":
        return "die"
    if gender == "Masc":
        return "der"
    if gender == "Fem":
        return "die"
    if gender == "Neut":
        return "das"
    return None

def pronunciation_difficulty(word: str):
    score = 0
    flags = []

    if any(c in word for c in "äöüß"):
        score += 1
        flags.append("special_chars")

    if len(word) > 10:
        score += 1
        flags.append("long_word")

    if any(cluster in word for cluster in ["sch", "ch", "sp", "st"]):
        score += 1
        flags.append("consonant_cluster")

    return {
        "score": score,
        "flags": flags
    }