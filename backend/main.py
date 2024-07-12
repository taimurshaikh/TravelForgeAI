from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # List of allowed methods (e.g., GET, POST)
    allow_headers=["*"],  # List of allowed headers
)

@app.get("/")
def read_root():
    return {"Hello": "World"}