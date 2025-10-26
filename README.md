# TeledentAI Frontend - Secure Vercel Deployment

A secure React frontend for dental image analysis using AI, with Vercel serverless functions proxying Hugging Face API calls.

## 🔒 Security Architecture

This application uses a **secure proxy pattern** to protect API credentials:

```
User Browser → Vercel Frontend → Vercel Serverless Functions → Hugging Face Space
                                  (Secure server-side)
```

- ✅ **No API keys in frontend code**
- ✅ **No direct API calls from browser**
- ✅ **All sensitive data server-side only**

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- Vercel CLI: `npm install -g vercel`
- Vercel account (free)

### Local Development

```bash
# 1. Install dependencies
npm install
cd api && npm install && cd ..

# 2. Configure environment
cp env.example .env
# Edit .env with your HF_SPACE_URL

# 3. Start development server
vercel dev
```

Visit `http://localhost:3000`

### Deploy to Production

```bash
# Deploy to Vercel
vercel --prod

# Or connect your Git repo to Vercel for auto-deployments
```

**Important**: Set environment variables in Vercel Dashboard after deployment!

## 📁 Project Structure

```
TeledentAI_FrontEnd/
├── api/                          # Vercel Serverless Functions
│   ├── predict-json.js          # JSON detection results
│   ├── predict-image.js         # Annotated images  
│   ├── health.js                # Health check
│   └── package.json             # API dependencies
├── src/
│   ├── config/
│   │   └── apiConfig.js         # API endpoints (now using /api/*)
│   ├── services/
│   │   └── api.js               # Updated to call serverless functions
│   └── Pages/
│       └── Results.js           # Uses secure API
├── vercel.json                  # Vercel configuration
├── env.example                  # Environment variables template
└── DEPLOYMENT_AND_TESTING.md    # Detailed testing guide
```

## 🔐 Environment Variables

Required in Vercel Dashboard (Settings → Environment Variables):

| Variable | Value | Required |
|----------|-------|----------|
| `HF_SPACE_URL` | `https://nawaf707-teledentai.hf.space` | Yes |
| `HF_TOKEN` | Your HF token | No (only for private spaces) |

## 🧪 Testing

### Test Health Endpoint
```bash
curl http://localhost:3000/api/health
```

### Test Prediction
```bash
curl -X POST http://localhost:3000/api/predict-json \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,..."}'
```

### Verify Security
1. Open browser DevTools → Network tab
2. Test image detection
3. ✅ All requests should go to `/api/*`
4. ❌ No requests to `hf.space` directly

See [DEPLOYMENT_AND_TESTING.md](./DEPLOYMENT_AND_TESTING.md) for comprehensive testing guide.

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check API health |
| `/api/predict-json` | POST | Get detection results (JSON) |
| `/api/predict-image` | POST | Get annotated image |

All endpoints accept/return JSON and include CORS headers.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start with Vercel dev (recommended - includes API functions)
vercel dev

# Or use standard React dev server (API functions won't work)
npm start

# Build for production
npm run build

# Deploy
vercel --prod
```

## 📦 Dependencies

### Frontend
- React 18
- React Router
- Tailwind CSS
- i18next (internationalization)

### API Functions
- node-fetch (HTTP requests)
- form-data (multipart/form-data handling)

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration
- `package.json` - Frontend dependencies
- `api/package.json` - API function dependencies
- `.env` - Local environment variables (not committed)
- `env.example` - Environment variables template

## 🚨 Troubleshooting

### API returns 500 errors
- Check Vercel function logs in dashboard
- Verify `HF_SPACE_URL` is set correctly
- Test HF Space directly: `curl https://your-space.hf.space/healthcheck`

### CORS errors
- Clear browser cache
- Verify `vercel.json` CORS configuration
- Check that you're not mixing HTTP/HTTPS

### Function timeouts
- Vercel free tier: 10s timeout
- Vercel Pro: 60s timeout
- Check HF Space response time

See [DEPLOYMENT_AND_TESTING.md](./DEPLOYMENT_AND_TESTING.md) for more troubleshooting tips.

## 📚 Documentation

- [Deployment & Testing Guide](./DEPLOYMENT_AND_TESTING.md) - Complete testing checklist
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)

## 🔒 Security Features

✅ **Implemented:**
- Serverless proxy for all API calls
- Environment variables for sensitive data
- No credentials in frontend code
- Input validation (file size, format)
- Error handling without info leakage
- CORS properly configured

🎯 **Recommended:**
- Add rate limiting
- Add user authentication
- Set up monitoring/alerts
- Add request signing

## 📝 License

[Your License]

## 🤝 Contributing

[Your contribution guidelines]

---

**Need help?** Check [DEPLOYMENT_AND_TESTING.md](./DEPLOYMENT_AND_TESTING.md) for detailed instructions.

