from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import clients, projects, bills, finance, valuations, vendors, admin, valuation_templates
from .database import engine, Base

app = FastAPI()

# CORS configuration
import os

# Allow all origins in production, specific origins in development
if os.getenv("ENVIRONMENT") == "production":
    origins = ["*"]
else:
    origins = [
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:8082",  # Vanilla JS frontend
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8082",  # Vanilla JS frontend
    ]

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(clients.router)
app.include_router(projects.router)
app.include_router(bills.router)
app.include_router(finance.router)
app.include_router(valuations.router)
app.include_router(vendors.router)
app.include_router(admin.router)
app.include_router(valuation_templates.router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Serve static files (CSS, JS, Images)
# Mount the entire frontend directory to /static
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Ensure we can find the frontend directory regardless of where the script is run
# Assuming running from root, 'frontend' is correct. 
# If running from backend dir, we might need '../frontend'
# But for Render with root dir set to '.', 'frontend' is correct.
if os.path.exists("frontend"):
    app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Serve index.html on root
@app.get("/")
async def serve_index():
    return FileResponse("frontend/index.html")
