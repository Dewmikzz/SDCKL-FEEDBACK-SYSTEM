# Firebase Configuration for SDCKL Feedback System

## Your Firebase Project
- **Project ID**: `sdckl-feeds`
- **Project URL**: https://console.firebase.google.com/u/0/project/sdckl-feeds

## Important: You Need Service Account (Not Client Config)

The client config you provided is for frontend. For Vercel/server-side, you need:

### Step 1: Get Service Account Key

1. Go to: https://console.firebase.google.com/u/0/project/sdckl-feeds/settings/serviceaccounts/adminsdk
2. Click "Generate New Private Key"
3. Click "Generate Key" in the popup
4. **Download the JSON file**
5. **Copy the entire JSON content**

### Step 2: Set Up Firestore (Not Realtime Database)

Your project currently uses Realtime Database, but we need **Firestore**:

1. Go to: https://console.firebase.google.com/u/0/project/sdckl-feeds/firestore
2. Click "Create Database"
3. Choose **Production mode**
4. Select location: **asia-southeast1** (or closest to you)
5. Click "Enable"

### Step 3: Set Firestore Security Rules

Go to: Firestore Database → Rules

Paste this:
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

Click "Publish"

### Step 4: Add to Vercel Environment Variables

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
- **Key**: `FIREBASE_SERVICE_ACCOUNT`
- **Value**: Paste the ENTIRE JSON from the service account file (as one line)

**Format Example:**
```json
{"type":"service_account","project_id":"sdckl-feeds","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

### Step 5: For Local Development (Optional)

Create `firebase-service-account.json` in project root with the service account JSON.

**⚠️ This file is in .gitignore - don't commit it!**

## After Setup

1. Push code to GitHub (already done)
2. Vercel will auto-deploy
3. Test your deployment!

## Admin Credentials

- Username: `admin@sdckl`
- Password: `sdckladmin123@`

