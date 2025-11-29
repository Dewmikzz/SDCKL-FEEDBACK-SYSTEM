# Vercel Deployment Guide

## Prerequisites
1. GitHub account with repository pushed
2. Vercel account (free tier works)
3. Repository: https://github.com/dewxyz99/sdckl-feedback-system.git

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import from GitHub: `dewxyz99/sdckl-feedback-system`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install && cd client && npm install`

4. **Environment Variables**
   Add these in Vercel dashboard:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `your-secret-key-change-this` (use a strong random string)
   - `PORT` = `5000` (optional, Vercel handles this)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? sdckl-feedback-system
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

## Post-Deployment

### Access Your Application
- **Public URL**: Your Vercel deployment URL (e.g., `https://sdckl-feedback-system.vercel.app`)
- **Feedback Form**: `https://your-url.vercel.app/`
- **Admin Login**: `https://your-url.vercel.app/admin/login`
- **Credentials**: 
  - Username: `admin@sdckl`
  - Password: `sdckladmin123@`

### Multi-Device Access
✅ The application is configured to work from:
- Any device (mobile, tablet, desktop)
- Any IP address
- Any location
- Multiple users simultaneously

### Features Enabled
- ✅ CORS configured for all origins
- ✅ Responsive design for all screen sizes
- ✅ Real-time updates (30-second polling)
- ✅ QR Code ready (use your Vercel URL)

## Troubleshooting

### Database Issues
- Vercel uses serverless functions with `/tmp` directory
- Database is stored in `/tmp/feedback.db` (ephemeral)
- For persistent storage, consider:
  - Vercel Postgres (paid)
  - External database service
  - Or use Vercel KV (Redis)

### Build Errors
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard
- Verify Node.js version (Vercel auto-detects)

### API Not Working
- Check that routes are properly configured in `vercel.json`
- Verify CORS settings allow your domain
- Check environment variables are set

## Updating Your Deployment

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel will auto-deploy on push
# Or manually deploy:
vercel --prod
```

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Support

For issues, check:
- Vercel Dashboard logs
- GitHub repository: https://github.com/dewxyz99/sdckl-feedback-system
- Vercel documentation: https://vercel.com/docs

