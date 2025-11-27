# Vanilla JS Frontend for Arcnspacedesigns

This is a vanilla HTML/CSS/JavaScript frontend that connects to the FastAPI + PostgreSQL backend.

## Features

- ✅ No build process required
- ✅ Tailwind CSS via CDN
- ✅ Hash-based routing
- ✅ Responsive design
- ✅ Full CRUD operations

## How to Run

1. **Start the Backend** (if not already running):
   ```bash
   cd E:\WEBSITE\Arcnspacedesigns
   uvicorn backend.main:app --reload
   ```

2. **Open the Frontend**:
   - Simply open `frontend/index.html` in your browser
   - Or use a local server:
     ```bash
     cd frontend
     python -m http.server 8080
     ```
   - Then visit: http://localhost:8080

## Pages

- **Dashboard**: Overview with statistics and quick actions ✅
- **Clients**: Full client management with file uploads ✅
- **Projects**: Coming soon
- **Vendors**: Coming soon
- **Bills**: Coming soon
- **Amount**: Coming soon
- **Valuation**: Coming soon

## API Connection

The frontend connects to the backend at `http://127.0.0.1:8000`

Make sure your backend is running before using the frontend!

## Technology Stack

- **HTML5**: Structure
- **Tailwind CSS**: Styling (via CDN)
- **Vanilla JavaScript**: Logic
- **Fetch API**: HTTP requests
- **FastAPI**: Backend (unchanged)
- **PostgreSQL**: Database (unchanged)
