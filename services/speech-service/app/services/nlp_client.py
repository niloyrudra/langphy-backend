import os
import httpx

# NLP_SERVICE_URL = "http://nlp-service:8000"
NLP_SERVICE_URL = os.getenv(
    "NLP_SERVICE_URL",
    "http://nlp-srv:8000"
)

async def evaluate_text(expected: str, spoken: str):
    # timeout = httpx.Timeout(10.0, connect=5.0, read=10.0, write=30.0)
    timeout = httpx.Timeout(10.0, connect=5.0)
    async with httpx.AsyncClient( timeout=timeout ) as client:
        response = await client.post(
            f"{NLP_SERVICE_URL}/api/nlp/analyze/evaluate-speaking",
            json={
                "expected_text": expected,
                "spoken_text": spoken
            },
            timeout=10
        )
        
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            return {
                "error": "NLP service failed",
                "detail": str(e),
                "status_code": e.response.status_code
            }
