// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase Console'dan aldığınız config bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Kendi bilgilerinizi yazın
  authDomain: "online-notes-app-xxxxx.firebaseapp.com",
  databaseURL: "https://online-notes-app-xxxxx-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "online-notes-app-xxxxx",
  storageBucket: "online-notes-app-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxx"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Database ve Auth referansları
export const database = getDatabase(app);
export const auth = getAuth(app);
export default app;
