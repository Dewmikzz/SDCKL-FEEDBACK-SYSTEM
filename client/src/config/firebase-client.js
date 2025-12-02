// Firebase Client Configuration (for future use if needed)
// This is separate from server-side Firebase Admin

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCA7s-2T8bu3SqKGBE4ve_4C7qJkPUGAdU",
  authDomain: "sdckl-feeds-ef6f0.firebaseapp.com",
  databaseURL: "https://sdckl-feeds-ef6f0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sdckl-feeds-ef6f0",
  storageBucket: "sdckl-feeds-ef6f0.firebasestorage.app",
  messagingSenderId: "100888074826",
  appId: "1:100888074826:web:0a54e52b9b9552ab5fa4b3",
  measurementId: "G-MYQ1B5JXQZ"
};

// Initialize Firebase (for future client-side features)
const app = initializeApp(firebaseConfig);

// Analytics (optional)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };

