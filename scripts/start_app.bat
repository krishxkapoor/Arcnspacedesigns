@echo off
echo Starting Arcnspacedesigns System...

:: Navigate to project root
cd ..

:: Start Backend
start "Backend API" cmd /k "call .venv\Scripts\activate && uvicorn backend.main:app --reload"

:: Wait for backend to start
timeout /t 5

:: Start Frontend Server
cd frontend
start "Frontend Server" cmd /k "python -m http.server 8082"

:: Open in Browser
timeout /t 2
start http://localhost:8082

echo System started!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:8082
