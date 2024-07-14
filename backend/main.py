from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langgraph_agent import TravelForgeAgent
from db import init_db, store_task, get_task
import uuid

app = FastAPI()


# Initialize the database when the app starts
@app.on_event("startup")
async def startup_event():
    init_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ItineraryRequest(BaseModel):
    location: str
    time_range: str
    budget: str
    accommodation_type: str
    num_days: int
    interests: list[str]


async def generate_itinerary_background(task_id: str, user_form_submission: dict):
    tf = TravelForgeAgent()
    result = tf.run(user_form_submission)
    store_task(task_id, "SUCCESS", result)


@app.post("/generate-itinerary")
async def generate_itinerary(
    request: ItineraryRequest, background_tasks: BackgroundTasks
):
    task_id = str(uuid.uuid4())  # Generate a unique task ID
    store_task(task_id, "PENDING")
    background_tasks.add_task(
        generate_itinerary_background, task_id, request.model_dump()
    )
    return {"task_id": task_id, "message": "Itinerary generation in progress"}


@app.get("/task-status/{task_id}")
async def get_task_status(task_id: str):
    task_result = get_task(task_id)
    return task_result or {"state": "NOT_FOUND"}
