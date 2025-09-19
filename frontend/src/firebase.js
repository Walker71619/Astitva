// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyCK0OMqe0hcVFLUcNyc-gCp8jYnT6Am2AU",
  authDomain: "astitva-e85ad.firebaseapp.com",
  databaseURL: "https://astitva-e85ad-default-rtdb.firebaseio.com", 
  projectId: "astitva-e85ad",
  storageBucket: "astitva-e85ad.firebasestorage.app",
  messagingSenderId: "979249435851",
  appId: "1:979249435851:web:70e0f7f9019fd59b27774e",
  measurementId: "G-3T538FEZSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getFirestore(app); 
export { app, analytics, auth, firestore, storage, database };
