from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import clients, projects, bills, finance, valuations, vendors, admin, valuation_templates
from .database import engine, Base

app = FastAPI()

# CORS configuration
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

@app.get("/")
async def root():
    return {"message": "Welcome to Archiva Studio API"}
