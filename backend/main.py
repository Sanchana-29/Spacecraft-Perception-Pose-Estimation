from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router


app = FastAPI(
    title="Spacecraft Perception and Pose Estimation Backend",
    description="Backend API for spacecraft sensor, detection and pose estimation",
    version="1.0.0"
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Connect API routes
app.include_router(router)


@app.get("/")
def root():
    return {
        "system": "Spacecraft Perception and Pose Estimation",
        "backend": "online",
        "status": "ready"
    }