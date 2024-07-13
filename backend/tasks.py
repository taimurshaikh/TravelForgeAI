from celery import Celery
from langgraph_agent import TravelForgeAgent
import os
from dotenv import load_dotenv

load_dotenv()

redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", "6379")

celery_app = Celery(
    "tasks",
    broker=f"redis://{redis_host}:{redis_port}/0",
    backend=f"redis://{redis_host}:{redis_port}/0",
)

celery_app.conf.update(
    result_expires=3600,
)


@celery_app.task
def generate_itinerary_task(user_form_submission):
    tf = TravelForgeAgent()
    return tf.run(user_form_submission)
