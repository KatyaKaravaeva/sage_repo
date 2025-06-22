from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal
from openai import OpenAI
import os
from instruction import system_instr
import markdown

client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_KEY")
)
app = FastAPI(
    title="TheSage AI Backend",
    description="Backend for AI-powered assistant.",
    version="1.0.0",
)

# --- Pydantic Models (Data Validation) ---

class ChatMessage(BaseModel):
    message: str
    context: Optional[str] = None
    timestamp: int
    role: Literal["STUDENT", "SAGE"]

class TestCase(BaseModel):
    stdin: str
    expected: str
    visibility: Literal["SHOW", "HIDE"]

class AttemptTestCase(TestCase):
    got: str
    isCorrect: bool = Field(..., alias="correct")

    @validator("isCorrect", pre=True)
    def parse_correct(cls, value):
        if isinstance(value, str):
            return value.lower() == 'true'
        return bool(value)



class QuestionData(BaseModel):
    questionName: str
    questionText: str
    language: str
    answer: str
    currentAnswer: Optional[str] = None
    lastSubmittedAnswer: Optional[str] = None
    lastInteracted: int
    testCases: List[TestCase]
    attemptTestCases: Optional[List[AttemptTestCase]] = None


class Question(BaseModel):
    question: QuestionData


class ActionRequest(BaseModel):
    requestType: Literal["ADVICE", "ERROR_EXPLAIN", "CHAT_ANALYZE", "EXPLAIN"]
    quizName: str
    currentTimestamp: int
    chat: List[ChatMessage]
    questions: List[Question]


class AvailabilityResponse(BaseModel):
    available: bool


# --- AI Processing Function ---
def process_through_ai(example, model="Qwen/Qwen2.5-Coder-32B-Instruct-fast"):
    """Обрабатывает запрос через языковую модель."""
    try:
        response = client.chat.completions.create(
            model=model,
            max_tokens=512,
            temperature=0.5,
            top_p=0.95,
            messages=[
                {
                    "role": "system",
                    "content":  system_instr
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": str(example)
                        }
                    ]
                }
            ]
        )
        return markdown.markdown(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing error: {e}")


# --- API Endpoints ---

@app.post("/api/process_action", response_model=str)
async def process_action(request_data: ActionRequest = Body(...)):
    """
    Обрабатывает запрос на действие, отправляя данные в AI и возвращая ответ.
    """
    ai_response = process_through_ai(request_data.model_dump(by_alias=True))
    return ai_response



@app.get("/api/status/check_availability", response_model=AvailabilityResponse)
async def check_availability():
    """Проверяет доступность сервиса."""
    return AvailabilityResponse(available=True)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)