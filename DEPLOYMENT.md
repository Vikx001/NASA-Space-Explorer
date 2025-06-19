# 🚀 Deployment Guide

This guide covers deploying both the frontend and backend components of the NASA API Explorer application.

## 📋 Prerequisites

- Node.js 16+ installed
- Git repository set up
- NASA API key (optional, demo key included)

## 🌐 Frontend Deployment

### Vercel (Recommended)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

### Netlify

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy build folder to Netlify**
   - Drag and drop `build` folder to Netlify
   - Or connect GitHub repository

3. **Environment Variables**
   Set in Netlify dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

## 🖥️ Backend Deployment

### Render (Recommended)

1. **Create render.yaml**
   ```yaml
   services:
     - type: web
       name: nasa-api-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: FRONTEND_URL
           value: https://your-frontend-url.com
         - key: NASA_API_KEY
           value: your_nasa_api_key
   ```

2. **Deploy to Render**
   - Connect GitHub repository
   - Select backend folder
   - Deploy

### Heroku

1. **Create Procfile**
   ```
   web: node server.js
   ```

2. **Deploy to Heroku**
   ```bash
   cd backend
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend-url.com
   heroku config:set NASA_API_KEY=your_nasa_api_key
   git push heroku main
   ```

### Railway

1. **Deploy to Railway**
   ```bash
   cd backend
   railway login
   railway new
   railway up
   ```

2. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set FRONTEND_URL=https://your-frontend-url.com
   railway variables set NASA_API_KEY=your_nasa_api_key
   ```

## 🔧 Environment Configuration

### Production Environment Variables

**Backend (.env)**
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
NASA_API_KEY=your_nasa_api_key_here
```

**Frontend (.env.production)**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## 🔒 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Configure CORS for production domains only
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Consider implementing rate limiting for production

## 📊 Monitoring

### Backend Monitoring
- Use services like New Relic, DataDog, or built-in platform monitoring
- Monitor API response times and error rates
- Set up alerts for downtime

### Frontend Monitoring
- Use Google Analytics or similar for user analytics
- Monitor Core Web Vitals
- Set up error tracking with Sentry

## 🚀 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add your deployment steps here

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        # Add your deployment steps here
```

## 🔍 Testing Deployment

1. **Backend Health Check**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Frontend Accessibility**
   - Visit your frontend URL
   - Test all major features
   - Check mobile responsiveness

3. **API Integration**
   - Test NASA API endpoints
   - Verify real-time features work
   - Check error handling

## 📝 Post-Deployment Checklist

- [ ] Backend health endpoint responds
- [ ] Frontend loads without errors
- [ ] All API endpoints work correctly
- [ ] Real-time features function properly
- [ ] Mobile responsiveness verified
- [ ] Error handling works as expected
- [ ] Performance is acceptable
- [ ] Monitoring is set up
- [ ] SSL certificates are valid

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL environment variable
   - Verify CORS configuration in server.js

2. **API Key Issues**
   - Verify NASA_API_KEY is set correctly
   - Check API key validity

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **Runtime Errors**
   - Check environment variables
   - Review server logs
   - Verify external API availability

## 📞 Support

For deployment issues, check:
1. Platform-specific documentation
2. Application logs
3. Environment variable configuration
4. Network connectivity

---

**Happy Deploying! 🚀**
