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
        // Use service account from environment variable or JSON file
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
          ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
          : require('../../firebase-service-account.json');

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

const getDb = () => {
  if (!db) {
    throw new Error('Firebase not initialized. Call init() first.');
  }
  return db;
};

module.exports = {
  init,
  getDb
};

