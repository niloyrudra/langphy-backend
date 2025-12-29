from fastapi import FastAPI
from app.api.speech import router as speech_router

app = FastAPI(title="Speech Service")

app.include_router(speech_router)