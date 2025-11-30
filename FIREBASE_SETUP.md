# Firebase Setup Guide for Vercel

## Why Firebase?
SQLite doesn't work on Vercel serverless functions because:
- Vercel functions are stateless
- Database files get reset on each deployment
- No persistent storage

Firebase Firestore is perfect for Vercel!

## Step 1: Get Firebase Service Account

1. Go to: https://console.firebase.google.com/
2. Create a new project (or use existing)
3. Go to: Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. **Save the JSON content** - you'll need it for Vercel

## Step 2: Set Up Firestore Database

1. In Firebase Console, go to: Firestore Database
2. Click "Create Database"
3. Start in **Production mode** (we'll set rules later)
4. Choose a location (closest to your users)
5. Click "Enable"

## Step 3: Set Firestore Security Rules

Go to: Firestore Database → Rules

Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Feedback collection - public read, authenticated write
    match /feedback/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Admins collection - only authenticated read/write
    match /admins/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click "Publish"

## Step 4: Add to Vercel Environment Variables

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add this variable:

**Key:** `FIREBASE_SERVICE_ACCOUNT`
**Value:** Paste the entire JSON content from the service account file (as a single line JSON string)

Example format:
```json
{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Important:** 
- Paste the ENTIRE JSON as one line
- Or use the format shown in the code (it will parse it)

## Step 5: Alternative - Use JSON File (Local Development)

For local development, create `firebase-service-account.json` in the root directory:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  ...
}
```

**⚠️ Add to .gitignore:**
```
firebase-service-account.json
```

## Step 6: Deploy to Vercel

1. Push code to GitHub
2. Vercel will auto-deploy
3. Make sure `FIREBASE_SERVICE_ACCOUNT` environment variable is set
4. Test your deployment!

## Benefits of Firebase

✅ Works perfectly on Vercel serverless
✅ Persistent database (data doesn't reset)
✅ Real-time updates possible
✅ Scalable
✅ Free tier: 50K reads, 20K writes per day
✅ Worldwide access enabled

## Admin Credentials

After setup, default admin will be created:
- Username: `admin@sdckl`
- Password: `sdckladmin123@`

## Troubleshooting

**Error: "Firebase not initialized"**
- Check `FIREBASE_SERVICE_ACCOUNT` environment variable is set
- Verify JSON format is correct

**Error: "Permission denied"**
- Check Firestore security rules
- Verify service account has proper permissions

**Data not saving**
- Check Firestore rules allow writes
- Verify Firebase project is active

