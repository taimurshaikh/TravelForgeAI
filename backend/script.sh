#!/bin/sh

# Start Celery worker in the background
celery -A tasks.celery_app worker --loglevel=info &

# Start uvicorn server
uvicorn main:app --host 0.0.0.0 --port 8000
