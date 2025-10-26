# TeledentAI Security Implementation - Deployment & Testing Guide

## 🔒 Security Implementation Summary

Your application has been secured with the following changes:

### What Was Changed:
1. ✅ **Removed direct Hugging Face API calls** from frontend code
2. ✅ **Created 3 Vercel serverless functions** to proxy all API requests:
   - `/api/predict-json.js` - Detection results (JSON)
   - `/api/predict-image.js` - Annotated images
   - `/api/health.js` - Health check
3. ✅ **Updated frontend** to call serverless functions instead of direct HF Space
4. ✅ **Environment variables** configured for secure token storage

### Security Improvements:
- 🔐 Hugging Face Space URL is never exposed in client code
- 🔐 Optional HF_TOKEN support for private spaces (stored server-side only)
- 🔐 Rate limiting and access control can now be added at the serverless function level
- 🔐 CORS properly configured
- 🔐 Error handling prevents information leakage

---

## 📋 Prerequisites

1. **Vercel Account** (free tier works fine)
   - Sign up at: https://vercel.com/signup

2. **Vercel CLI** (for local testing)
   ```bash
   npm install -g vercel
   ```

3. **Node.js** (v14 or higher)

---

## 🚀 Deployment Steps

### Step 1: Install Dependencies

```bash
cd TeledentAI_FrontEnd

# Install frontend dependencies
npm install

# Install API dependencies
cd api
npm install
cd ..
```

### Step 2: Local Testing with Vercel Dev Server

This is the **recommended way** to test locally because it simulates the Vercel environment:

```bash
cd TeledentAI_FrontEnd

# Start Vercel dev server (includes API functions)
vercel dev
```

When prompted:
- **Set up and develop**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No (first time)
- **Project name**: teledentai (or your preferred name)
- **Directory**: `./` (current directory)

The dev server will start on `http://localhost:3000`

**Note**: Vercel dev automatically:
- Serves your React app
- Runs serverless functions at `/api/*`
- Hot-reloads on changes

### Step 3: Configure Environment Variables (Local)

Create a `.env` file in the root of `TeledentAI_FrontEnd`:

```bash
# Copy the example file
cp env.example .env
```

Edit `.env` and add your configuration:

```env
HF_SPACE_URL=https://nawaf707-teledentai.hf.space
HF_TOKEN=
```

**Note**: `HF_TOKEN` is optional. Only needed if your Hugging Face Space is private.

### Step 4: Test the API Endpoints

#### Test 1: Health Check
```bash
# Should return: {"healthcheck":"Everything OK!","backend":{...},"timestamp":"..."}
curl http://localhost:3000/api/health
```

#### Test 2: Prediction (JSON)
```bash
# Using a test image (base64)
curl -X POST http://localhost:3000/api/predict-json \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

#### Test 3: Frontend Integration
1. Open `http://localhost:3000` in your browser
2. Navigate to the camera/capture page
3. Take a photo or upload an image
4. Check browser console for API logs:
   - Should see: `[API] Security Mode: All requests proxied through Vercel serverless functions`
   - Should see: `[API] Sending POST to /api/predict-json...`
   - Should NOT see any direct calls to `nawaf707-teledentai.hf.space`

### Step 5: Deploy to Vercel

```bash
cd TeledentAI_FrontEnd

# Deploy to production
vercel --prod
```

Or use the Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect the React app
5. Click "Deploy"

### Step 6: Configure Production Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `HF_SPACE_URL` | `https://nawaf707-teledentai.hf.space` | Production, Preview, Development |
| `HF_TOKEN` | `your_token_here` (optional) | Production, Preview, Development |

4. Click **Save**
5. **Redeploy** your application for changes to take effect

---

## 🧪 Testing Checklist

### ✅ Local Development Testing

- [ ] Health check endpoint responds: `curl http://localhost:3000/api/health`
- [ ] Frontend loads without errors
- [ ] Console shows "Security Mode: All requests proxied"
- [ ] No direct HF Space URL visible in browser DevTools → Network tab
- [ ] Image upload and detection works
- [ ] Annotated images display correctly
- [ ] Error handling works (test with invalid image data)

### ✅ Production Testing

After deploying to Vercel:

- [ ] Visit your Vercel URL (e.g., `https://teledentai.vercel.app`)
- [ ] Health check: `https://teledentai.vercel.app/api/health`
- [ ] Test complete workflow:
  1. Navigate to capture page
  2. Take/upload dental image
  3. View detection results
  4. Verify annotated images display
- [ ] Check Vercel logs for any errors:
  - Go to Vercel Dashboard → Your Project → Functions
  - Click on a function to see logs

### ✅ Security Verification

- [ ] Open browser DevTools → Network tab
- [ ] Perform an image detection
- [ ] Verify ALL requests go to `/api/*` endpoints
- [ ] Verify NO requests go directly to `nawaf707-teledentai.hf.space`
- [ ] View page source - confirm no HF Space URL in HTML/JS
- [ ] Search in browser DevTools → Sources for "hf.space" - should find nothing in production build

---

## 🔍 Debugging Tips

### Issue: "API request failed with status 500"

**Check Vercel Function Logs:**
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on the failing function
3. Review the error logs

**Common causes:**
- Missing environment variables (`HF_SPACE_URL`)
- Hugging Face Space is down or slow
- Image size too large (>10MB)

### Issue: "Unable to reach AI service"

**Verify HF Space is running:**
```bash
curl https://nawaf707-teledentai.hf.space/healthcheck
```

Should return: `{"healthcheck":"Everything OK!"}`

### Issue: CORS errors

**Solution:** The serverless functions already include CORS headers. If you still see CORS errors:
1. Clear browser cache
2. Make sure you're not mixing HTTP/HTTPS
3. Check Vercel deployment logs

### Issue: Function timeout

Vercel free tier has a 10-second timeout. If your HF Space is slow:
1. Consider upgrading to Vercel Pro (60s timeout)
2. Or optimize your model inference time
3. Check function logs for actual duration

### Issue: Large images fail

The serverless functions limit images to 10MB. If needed, adjust in the API files:
```javascript
const MAX_SIZE = 10 * 1024 * 1024; // Change this value
```

---

## 🎯 Quick Start Commands

```bash
# 1. Install everything
cd TeledentAI_FrontEnd && npm install && cd api && npm install && cd ..

# 2. Create local environment file
cp env.example .env

# 3. Start local dev server
vercel dev

# 4. Deploy to production
vercel --prod
```

---

## 📊 Monitoring

### View Function Logs (Production)
1. Vercel Dashboard → Your Project → Functions
2. Click on any function to see real-time logs
3. Filter by time range or status code

### Check API Performance
Monitor these metrics in Vercel Dashboard:
- Function invocations
- Average duration
- Error rate
- Bandwidth usage

---

## 🔐 Security Best Practices

### ✅ Already Implemented:
- API keys/tokens stored in environment variables
- No sensitive data in client-side code
- CORS properly configured
- Error messages don't leak sensitive info
- Input validation (file size, format)

### 🎯 Recommended Additional Security:
1. **Rate Limiting**: Add rate limiting to serverless functions
   ```javascript
   // Example: Using upstash/ratelimit
   import { Ratelimit } from "@upstash/ratelimit";
   ```

2. **Authentication**: Add user authentication
   - Consider NextAuth.js or Auth0
   - Only allow authenticated users to call API

3. **Request Signing**: Add request signatures
   - Prevent API abuse from scrapers

4. **Monitoring**: Set up alerts
   - Unusual traffic patterns
   - High error rates
   - Slow response times

---

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HF_SPACE_URL` | Yes | `https://nawaf707-teledentai.hf.space` | Your Hugging Face Space URL |
| `HF_TOKEN` | No | - | HF token for private spaces |
| `REACT_APP_API_URL` | No | `""` (relative) | Override API base URL |

---

## 🆘 Need Help?

1. **Check Vercel Docs**: https://vercel.com/docs
2. **Check function logs** in Vercel Dashboard
3. **Test locally first** with `vercel dev`
4. **Verify environment variables** are set correctly

---

## ✨ What's Next?

After successful deployment:
1. ✅ Test all features thoroughly
2. ✅ Monitor function logs for errors
3. ✅ Set up custom domain (optional)
4. ✅ Configure production environment variables
5. ✅ Add rate limiting (recommended)
6. ✅ Set up error monitoring (Sentry, etc.)

Your application is now secure and ready for production! 🎉

