# SDCKL Feedback System

Feedback system for Sentral Digital College Kuala Lumpur.

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Setup Firebase Service Account

1. Go to: https://console.firebase.google.com/project/sdckl-feeds-ef6f0/settings/serviceaccounts/adminsdk
2. Click "Generate New Private Key"
3. Download the JSON file
4. Rename it to `firebase-service-account.json`
5. Place it in the **root directory** of this project

### 3. Setup Firestore Database

1. Go to: https://console.firebase.google.com/project/sdckl-feeds-ef6f0/firestore
2. Click "Create Database" (if not exists)
3. Choose **Production mode**
4. Select location: **asia-southeast1**
5. Click "Enable"

### 4. Set Firestore Security Rules

Go to: Firestore Database → Rules

Paste this and click "Publish":
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

### 5. Run the Application

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin Login: http://localhost:5173/admin/login
  - Username: `admin@sdckl`
  - Password: `sdckladmin123@`

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── api/             # Vercel serverless functions
└── firebase-service-account.json  # Firebase credentials (not in git)
```

## Requirements

- Node.js 18+ 
- Firebase project: `sdckl-feeds-ef6f0`
- Firestore database created

