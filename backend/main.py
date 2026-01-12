import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load resources
    print("Startup: KetoVital Backend")
    yield
    # Clean up resources
    print("Shutdown: KetoVital Backend")

app = FastAPI(
    title="KetoVital API",
    description="Backend for KetoVital PWA: Google Drive Sync, AI Coach, and Vision",
    version="0.1.0",
    lifespan=lifespan
)

# Origins for CORS (Local + Production domains)
origins = [
    "http://localhost:3000",
    "https://keto-vital.vercel.app",  # Placeholder
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .api.routes import router as api_router

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "KetoVital Backend Online", "docs_url": "/docs"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
