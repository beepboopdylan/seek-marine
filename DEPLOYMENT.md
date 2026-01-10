# 🚀 Deployment Guide

Quick guide for deploying Seek Marine to production.

## Frontend Deployment (Vercel - Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variable:
     - Name: `VITE_API_BASE`
     - Value: `https://your-backend-url.com` (update after backend deployment)
   - Click "Deploy"

## Backend Deployment (Railway - Recommended)

1. **Create railway.json in backend folder**
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Configure:
     - Root Directory: `backend`
     - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Railway will auto-detect Python and install dependencies
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

3. **Update Frontend Environment**
   - Go back to Vercel
   - Settings → Environment Variables
   - Update `VITE_API_BASE` to your Railway URL
   - Redeploy the frontend

## Alternative: Render

### Backend on Render
- Create a new Web Service
- Connect your GitHub repo
- Configure:
  - Root Directory: `backend`
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend on Render
- Create a new Static Site
- Configure:
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Publish Directory: `dist`
  - Environment Variable: `VITE_API_BASE=https://your-backend.onrender.com`

## Testing Deployment

1. Open your frontend URL in a mobile browser
2. Try capturing/uploading an image
3. Verify the prediction works

## CORS Configuration

If you get CORS errors, update `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.vercel.app"],  # Update this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Cost Considerations

- **Vercel**: Free tier (generous limits)
- **Railway**: $5/month for Hobby plan (includes $5 credit)
- **Render**: Free tier available (may have cold starts)

Both frontend and backend can run on free tiers for portfolio projects!
