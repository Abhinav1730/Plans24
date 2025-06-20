// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "plans24-f1c50.firebaseapp.com",
  projectId: "plans24-f1c50",
  storageBucket: "plans24-f1c50.firebasestorage.app",
  messagingSenderId: "21106490826",
  appId: "1:21106490826:web:5d75b722d521333a806333",
  measurementId: "G-HHVDE0082T",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
