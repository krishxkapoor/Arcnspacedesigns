# Archiva Studio Backend

This is the FastAPI backend for Archiva Studio.

## Setup

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Database Setup**:
    - Ensure you have PostgreSQL installed and running.
    - Create a database named `archiva_db` (or update `DATABASE_URL` in `.env` or `database.py`).
    - The application will automatically create the tables on startup.

## Running the Server

Run the following command from the `backend` directory (or the root directory if you adjust the path):

```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`.
API Documentation: `http://localhost:8000/docs`.

## Running Tests

Make sure the server is running, then run:

```bash
python backend/test_api.py
```
