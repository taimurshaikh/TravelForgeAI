from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from celery.result import AsyncResult
from fastapi.middleware.cors import CORSMiddleware
from tasks import (
    generate_itinerary_task,
    celery_app,
)  # Import the Celery app from tasks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ItineraryRequest(BaseModel):
    city: str
    country: str
    time_range: str
    budget: str
    accomodation_type: str
    num_days: int
    interests: list[str]


@app.post("/generate-itinerary")
def generate_itinerary(request: ItineraryRequest, background_tasks: BackgroundTasks):
    print(request.model_dump())
    task = generate_itinerary_task.delay(request.model_dump())
    return {"task_id": task.id, "message": "Itinerary generation in progress"}


@app.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery_app)
    if task_result.state == "PENDING":
        response = {"state": task_result.state, "status": "Pending..."}
    elif task_result.state != "FAILURE":
        response = {"state": task_result.state, "result": task_result.result}
    else:
        response = {
            "state": task_result.state,
            "status": str(task_result.info),  # Exception info
        }
    return response
