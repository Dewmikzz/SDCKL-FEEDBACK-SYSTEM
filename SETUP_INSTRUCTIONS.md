# Setup Instructions for Vercel Deployment

## ⚠️ CRITICAL: These steps MUST be completed for the form to work!

### Step 1: Set Up Firebase Firestore Database

**This is REQUIRED before the form will work!**

1. Go to: https://console.firebase.google.com/project/sdckl-feeds-ef6f0/firestore
2. If you see "Create Database", click it. If database already exists, skip to Step 3.
3. Choose **Production mode**
4. Select location: **asia-southeast1** (or closest to you)
5. Click **Enable**

### Step 2: Set Firestore Security Rules

1. In Firebase Console, go to: **Firestore Database → Rules**
2. Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /feedback/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    match /admins/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

### Step 3: Add Environment Variables in Vercel

**Go to: Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these 3 variables (ALL are required):

#### Variable 1: NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Production, Preview, Development (select all)

#### Variable 2: JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: `sdckl-secret-key-2025-change-this` (or any strong random string)
- **Environment**: Production, Preview, Development (select all)

#### Variable 3: FIREBASE_SERVICE_ACCOUNT (MOST IMPORTANT!)
- **Key**: `FIREBASE_SERVICE_ACCOUNT`
- **Value**: (Get this from Firebase Console - see instructions below)
- **Environment**: Production, Preview, Development (select all)

**How to get FIREBASE_SERVICE_ACCOUNT:**

1. Go to: https://console.firebase.google.com/project/sdckl-feeds-ef6f0/settings/serviceaccounts/adminsdk
2. Click **"Generate New Private Key"** (or use existing key if you have the JSON file)
3. Download the JSON file
4. Open the JSON file and copy the ENTIRE content
5. Convert it to a single line (remove all line breaks and spaces between properties)
6. Paste the single-line JSON as the value in Vercel

**Important**: The JSON must be on ONE LINE with no line breaks. Use an online JSON minifier if needed.

### Step 4: Redeploy After Adding Environment Variables

1. After adding all environment variables, go to **Deployments** tab
2. Click the **3 dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (2-5 minutes)

### Step 5: Test the Form

1. Go to your deployed site: `https://your-project.vercel.app`
2. Fill out the feedback form
3. Submit it
4. If it works, you'll see a success message!

## Troubleshooting

### Error: "Something went wrong" when submitting form

**Check these:**

1. ✅ Is Firestore database created? (Step 1)
2. ✅ Are security rules published? (Step 2)
3. ✅ Is `FIREBASE_SERVICE_ACCOUNT` environment variable added? (Step 3)
4. ✅ Did you redeploy after adding environment variables? (Step 4)

### Check Vercel Build Logs

1. Go to: **Deployments** → Click on latest deployment
2. Check the **Build Logs** for errors
3. Look for:
   - "Firebase initialization error"
   - "FIREBASE_SERVICE_ACCOUNT not found"
   - "Firestore permission denied"

### Check Browser Console

1. Open your site
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Try submitting the form
5. Look for error messages (they will help identify the issue)

### Common Issues:

**Issue**: "Failed to submit feedback" or "Database error"
- **Solution**: Make sure `FIREBASE_SERVICE_ACCOUNT` is set correctly in Vercel

**Issue**: "Permission denied" error
- **Solution**: Check Firestore security rules are published (Step 2)

**Issue**: Form submits but nothing happens
- **Solution**: Check browser console for JavaScript errors

## Admin Login

After deployment works:
- URL: `https://your-project.vercel.app/admin/login`
- Username: `admin@sdckl`
- Password: `sdckladmin123@`

**⚠️ IMPORTANT**: Change the admin password after first login!

