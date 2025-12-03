@echo off
echo Starting Arcnspacedesigns...
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate
) else (
    echo Virtual environment not found, trying global python...
)

echo Starting Backend Server...
python -m uvicorn backend.main:app --reload --port 8082 --host 127.0.0.1

pause
