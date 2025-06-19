// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx1nH7WF75AfjK4HjIVqYtF1o6Alfyf8A",
  authDomain: "hohacricket.firebaseapp.com",
  projectId: "hohacricket",
  storageBucket: "hohacricket.appspot.com",
  messagingSenderId: "77987625287",
  appId: "1:77987625287:web:6260ae5541f25ab37c3462"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
