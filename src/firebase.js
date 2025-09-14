// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSXuiFUpO9a0aJkdP3OwikDlMUVNwMQXE",
  authDomain: "astitva-bea40.firebaseapp.com",
  projectId: "astitva-bea40",
  storageBucket: "astitva-bea40.firebasestorage.app",
  messagingSenderId: "34296155186",
  appId: "1:34296155186:web:0fd4476415d8bd437c802b",
  measurementId: "G-DE4FL7P9B6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);