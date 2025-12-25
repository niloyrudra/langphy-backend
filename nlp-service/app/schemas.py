from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    text: str

class LessonRequest(BaseModel):
    text: str

class AnswerRequest(BaseModel):
    expected: str
    user_answer: str