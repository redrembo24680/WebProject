from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(title="Personal Note Manager")

# Add CORS middleware with configurable origins
allowed_origins = [origin.strip() for origin in settings.allowed_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# ensure static/uploads exists
os.makedirs(os.path.join(os.getcwd(), "static", "uploads"), exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
