// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAx1nH7WF75AfjK4HjIVqYtF1o6Alfyf8A",
  authDomain: "hohacricket.firebaseapp.com",
  projectId: "hohacricket",
  storageBucket: "hohacricket.firebasestorage.app",
  messagingSenderId: "77987625287",
  appId: "1:77987625287:web:6260ae5541f25ab37c3462",
  measurementId: "G-NF0GPFLZ7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
