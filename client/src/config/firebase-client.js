// Firebase Client Configuration (for future use if needed)
// This is separate from server-side Firebase Admin

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBfDMwH3JX7YWWgjEZF5fQk-WOHQTBdydI",
  authDomain: "sdckl-feeds.firebaseapp.com",
  databaseURL: "https://sdckl-feeds-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sdckl-feeds",
  storageBucket: "sdckl-feeds.firebasestorage.app",
  messagingSenderId: "247239966416",
  appId: "1:247239966416:web:e7fed4bf69954c3c2c68d5",
  measurementId: "G-K0LG484JMN"
};

// Initialize Firebase (for future client-side features)
const app = initializeApp(firebaseConfig);

// Analytics (optional)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };

