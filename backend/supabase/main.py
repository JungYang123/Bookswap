import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from routers import 

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(title="GMU Bookswap API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# Example: app.include_router(auth.router, prefix="/auth", tags=["Authentication"])


@app.get("/")
def read_root():
    return {"message": "Welcome to GMU-BookSwap API"}



