from fastapi import FastAPI
from app.nlp import analyze_text, analyze_lesson, analyze_answer
from app.schemas import AnalyzeRequest, LessonRequest, AnswerRequest

app = FastAPI(title="Langphy NLP Service")

@app.post("/api/nlp/analyze")
def analyze(req: AnalyzeRequest):
    return analyze_text(req.text)

@app.post("/api/nlp/analyze/lesson")
def analyze(req: LessonRequest):
    return analyze_lesson( req.text )


@app.post("/api/nlp/analyze/answer")
def analyze(data: AnswerRequest):
    return analyze_answer( data.expected, data.user_answer )