from contextlib import asynccontextmanager
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from langgraph_agent import TravelForgeAgent
from db.db import init_db, store_task, get_task, drop_db
from middleware import log_requests
from starlette.middleware.base import BaseHTTPMiddleware
from schemas import ItineraryRequest
import uuid

app = FastAPI()


@app.on_event("startup")
async def startup():
    init_db()


app.add_middleware(BaseHTTPMiddleware, dispatch=log_requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
