// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAA7ChweLDgo2xaTVa-6TBSslgTOhh6sw",
  authDomain: "online-chess-7035c.firebaseapp.com",
  projectId: "online-chess-7035c",
  storageBucket: "online-chess-7035c.appspot.com",
  messagingSenderId: "580958851838",
  appId: "1:580958851838:web:bedb2e12fb10d5b4268baf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Storage
export const storage = getStorage(app);
