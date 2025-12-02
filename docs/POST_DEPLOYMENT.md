# Post-Deployment Configuration

## ⚠️ IMPORTANT: Update After Deployment

After your services are deployed on Render, you need to update the backend URL in the frontend.

### Step 1: Get Your Backend URL
After deploying, Render will give you a URL like:
```
https://arcnspacedesigns-backend-xxxx.onrender.com
```

### Step 2: Update Frontend API Configuration

Open `frontend/js/api.js` and update line 8:

**Current (default):**
```javascript
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : (import.meta?.env?.VITE_API_URL || 'https://arcnspacedesigns-backend.onrender.com');
```

**Update to your actual backend URL:**
```javascript
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : 'https://YOUR-ACTUAL-BACKEND-URL.onrender.com';
```

### Step 3: Commit and Push
```bash
git add frontend/js/api.js
git commit -m "Update production API URL"
git push origin main
```

Render will automatically redeploy your frontend with the updated URL.

---

## 🔍 How to Find Your Backend URL

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Click on your backend service (arcnspacedesigns-backend)
3. Copy the URL shown at the top (e.g., `https://arcnspacedesigns-backend-xxxx.onrender.com`)

---

## ✅ Verification

After updating, test your deployment:
1. Visit your frontend URL
2. Try logging in
3. Check browser console for any CORS or connection errors
4. Verify all features work correctly
