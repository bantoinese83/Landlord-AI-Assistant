from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, properties, tenants, maintenance, rent, ai

app = FastAPI(
    title="Landlord AI Assistant API",
    description="A comprehensive property management API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(properties.router)
app.include_router(tenants.router)
app.include_router(maintenance.router)
app.include_router(rent.router)
app.include_router(ai.router)


@app.get("/")
def read_root():
    return {"message": "Landlord AI Assistant API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
