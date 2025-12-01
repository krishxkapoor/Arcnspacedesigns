# Arcnspacedesigns Deployment Guide

## 🚀 Deploying to Render

### Prerequisites
- GitHub repository connected to Render
- Render account

### Deployment Steps

#### Option 1: Using render.yaml (Recommended)
1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Create New Web Service on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository: `krishxkapoor/Arcnspacedesigns`
   - Render will automatically detect `render.yaml` and create:
     - Backend API service
     - Frontend static site
     - PostgreSQL database

3. **Configure Environment Variables** (if needed):
   - The `render.yaml` handles most configuration automatically
   - Database URL is auto-configured
   - SECRET_KEY is auto-generated

#### Option 2: Manual Setup (Alternative)
If you prefer to set up services manually:

##### Backend Service
1. **Create Web Service**:
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ENVIRONMENT`: `production`
   - `SECRET_KEY`: Generate a secure random string

##### Frontend Service
1. **Create Static Site**:
   - Publish Directory: `./frontend`
   - No build command needed

##### Database
1. **Create PostgreSQL Database**:
   - Database Name: `factory_os`
   - Copy the connection string to backend's `DATABASE_URL`

### 📝 Important Notes

1. **Generated Files**: The `generated_valuations/` folder is excluded from git (see `.gitignore`)

2. **CORS**: The backend automatically allows all origins in production mode

3. **Database**: Tables are created automatically on first startup

4. **Frontend API URL**: Update `frontend/js/api.js` to point to your deployed backend URL:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.onrender.com';
   ```

### 🔧 Troubleshooting

**Build fails with "No such file or directory: 'requirements.txt'"**
- ✅ Fixed! `requirements.txt` is now in the root directory

**CORS errors**
- ✅ Fixed! Production mode allows all origins

**Database connection errors**
- Ensure PostgreSQL database is created on Render
- Check that `DATABASE_URL` environment variable is set correctly

**Frontend can't connect to backend**
- Update `API_BASE_URL` in `frontend/js/api.js` with your backend URL

### 🎯 Next Steps After Deployment

1. Test the login functionality
2. Verify all API endpoints work
3. Check that database operations are successful
4. Update frontend API URL if using separate services

---

**Need help?** Check [Render's documentation](https://render.com/docs) or the troubleshooting guide.
