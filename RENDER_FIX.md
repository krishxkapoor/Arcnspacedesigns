# Render Deployment Quick Fix Guide

## 🔧 Current Issue: Wrong Start Command

**Error**: `gunicorn: command not found`
**Cause**: Render is using the wrong start command (gunicorn instead of uvicorn)

---

## ✅ Solution Applied

### 1. Created `Procfile`
This tells Render exactly how to start your FastAPI application:
```
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 2. Updated `requirements.txt`
Added version specifications for better stability.

---

## 🚀 How to Fix Your Deployment

### Option A: Redeploy (Recommended)

1. **Push the changes**:
   ```bash
   git add Procfile requirements.txt
   git commit -m "Fix Render deployment - add Procfile"
   git push origin main
   ```

2. **Render will auto-redeploy** with the correct configuration

### Option B: Manual Configuration in Render Dashboard

If auto-deploy doesn't work, manually update in Render:

1. Go to your service in Render Dashboard
2. Click **"Settings"**
3. Update **Start Command** to:
   ```
   cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Click **"Save Changes"**
5. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 📋 Deployment Checklist

After pushing changes, verify:

- [ ] `Procfile` exists in root directory
- [ ] `requirements.txt` has `uvicorn[standard]`
- [ ] Render detects the Procfile
- [ ] Build succeeds
- [ ] Start command uses `uvicorn` (not `gunicorn`)
- [ ] Service starts successfully

---

## 🎯 Expected Output

After fix, you should see:
```
==> Running 'cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT'
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000
```

---

## 💡 Why This Happened

- Render auto-detected Python but defaulted to Django/Flask (gunicorn)
- FastAPI requires `uvicorn` instead
- `Procfile` explicitly tells Render which command to use

---

**Next**: Push these changes and Render will redeploy correctly! 🚀
