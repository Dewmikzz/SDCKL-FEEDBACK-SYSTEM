const admin = require('firebase-admin');

let db = null;
let initialized = false;

const init = () => {
  return new Promise((resolve, reject) => {
    if (initialized && db) {
      return resolve();
    }

    try {
      // Initialize Firebase Admin if not already initialized
      if (!admin.apps.length) {
        let serviceAccount;
        
        // Try environment variable first (for Vercel)
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
          try {
            serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string'
              ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
              : process.env.FIREBASE_SERVICE_ACCOUNT;
          } catch (e) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', e);
            throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT format');
          }
        } else {
          // Try local file (for development)
          try {
            serviceAccount = require('../../firebase-service-account.json');
          } catch (e) {
            throw new Error('Firebase service account not found. Set FIREBASE_SERVICE_ACCOUNT environment variable or add firebase-service-account.json file.');
          }
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      }

      db = admin.firestore();
      initialized = true;
      
      // Initialize default admin if needed
      initializeDefaultAdmin().then(() => {
        console.log('Firebase initialized successfully');
        resolve();
      }).catch(reject);
    } catch (error) {
      console.error('Firebase initialization error:', error);
      reject(error);
    }
  });
};

const initializeDefaultAdmin = async () => {
  const adminsRef = db.collection('admins');
  const adminDoc = await adminsRef.doc('admin@sdckl').get();
  
  if (!adminDoc.exists) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('sdckladmin123@', 10);
    
    await adminsRef.doc('admin@sdckl').set({
      username: 'admin@sdckl',
      password: hashedPassword,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Default admin created: username=admin@sdckl, password=sdckladmin123@');
  }
};

const getDb = async () => {
  // Ensure Firebase is initialized (important for serverless)
  if (!initialized || !db) {
    await init();
  }
  return db;
};

module.exports = {
  init,
  getDb
};
