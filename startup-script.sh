#!/bin/bash

# Navigate to the backend directory and start the FastAPI server
cd backend
echo "Starting FastAPI server..."
uvicorn main:app --reload &

# Store the PID of the FastAPI server
FASTAPI_PID=$!

# Navigate to the frontend directory and start the React project
cd ../frontend
echo "Starting React project..."
npm run dev &

# Store the PID of the React project
REACT_PID=$!

# Function to stop the servers when the script exits
cleanup() {
  echo "Stopping FastAPI server..."
  kill $FASTAPI_PID
  echo "Stopping React project..."
  kill $REACT_PID
}

# Trap the exit signal to run the cleanup function
trap cleanup EXIT

# Wait for the servers to run indefinitely
wait
