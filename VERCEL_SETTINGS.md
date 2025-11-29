# Vercel Project Settings (IMPORTANT)

## After the fix is deployed, configure these settings in Vercel:

### Go to: Project Settings → Build & Development Settings

1. **Framework Preset**: `Other` or `Vite`
2. **Root Directory**: `.` (root)
3. **Build Command**: `cd client && npm install && npm run build`
4. **Output Directory**: `client/dist`
5. **Install Command**: `npm install && cd client && npm install`

### Environment Variables:
- `NODE_ENV` = `production`
- `JWT_SECRET` = `your-strong-secret-key-here`

### Notes:
- ✅ Removed deprecated `builds` section from vercel.json
- ✅ Using modern Vercel routing
- ⚠️ npm deprecation warnings are harmless (just old package versions)
- ✅ The build will work despite the warnings

## After updating settings:
1. Click "Save"
2. Go to "Deployments" tab
3. Click "Redeploy" on the latest deployment
4. Wait for build to complete

## Test URLs:
- Feedback: https://sdckl-feedback-system.vercel.app/
- Admin: https://sdckl-feedback-system.vercel.app/admin/login

