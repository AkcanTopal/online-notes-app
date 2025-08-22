// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDR4lJpvF_hRGcwOyroTJpMWHCHMaaR7tU",
  authDomain: "note-cb624.firebaseapp.com",
  databaseURL: "https://note-cb624-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "note-cb624",
  storageBucket: "note-cb624.firebasestorage.app",
  messagingSenderId: "480694636092",
  appId: "1:480694636092:web:4dea434e18ac142413fd39",
  measurementId: "G-Q3VVVKMJY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
