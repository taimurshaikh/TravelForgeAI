import uuid

from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from db.db import init_db, store_task, get_task
from langgraph_agent import TravelForgeAgent
from middleware import log_requests
from schemas import ItineraryRequest

app = FastAPI()


@app.on_event("startup")
async def startup():
    """
    Event handler for FastAPI startup event.
    Initializes the database when the application starts.
    """
    init_db()


# Middleware to log requests
app.add_middleware(BaseHTTPMiddleware, dispatch=log_requests)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def generate_itinerary_background(task_id: str, user_form_submission: dict):
    """
    Background task to generate an itinerary.

    Args:
        task_id (str): The unique identifier for the task.
        user_form_submission (dict): The user's submitted preferences.
    """
    tf = TravelForgeAgent()
    result = tf.run(user_form_submission)
    store_task(task_id, "SUCCESS", result)


@app.post("/generate-itinerary")
async def generate_itinerary(
    request: ItineraryRequest, background_tasks: BackgroundTasks
):
    """
    API endpoint to generate an itinerary.

    Args:
        request (ItineraryRequest): The request body containing user preferences.
        background_tasks (BackgroundTasks): Background tasks manager.

    Returns:
        dict: Response containing the task ID and a message indicating progress.
    """
    task_id = str(uuid.uuid4())  # Generate a unique task ID
    store_task(task_id, "PENDING")
    background_tasks.add_task(
        generate_itinerary_background, task_id, request.model_dump()
    )
    return {"task_id": task_id, "message": "Itinerary generation in progress"}


@app.get("/task-status/{task_id}")
async def get_task_status(task_id: str):
    """
    API endpoint to check the status of a task.

    Args:
        task_id (str): The unique identifier for the task.

    Returns:
        dict: Task details including state and result, or a not found message.
    """
    task_result = get_task(task_id)
    return task_result or {"state": "NOT_FOUND"}
