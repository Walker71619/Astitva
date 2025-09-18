import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSXuiFUpO9a0aJkdP3OwikDlMUVNwMQXE",
  authDomain: "astitva-bea40.firebaseapp.com",
  databaseURL: "https://astitva-bea40-default-rtdb.firebaseio.com",
  projectId: "astitva-bea40",
  storageBucket: "astitva-bea40.appspot.com",
  messagingSenderId: "34296155186",
  appId: "1:34296155186:web:0fd4476415d8bd437c802b",
  measurementId: "G-DE4FL7P9B6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app); 
