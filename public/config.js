// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

//          for signup and login
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

//      for Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABwRJyK5SdeC4FM0jTbnVbiV4hU3TXB6I",
  authDomain: "mylaid-f9947.firebaseapp.com",
  projectId: "mylaid-f9947",
  storageBucket: "mylaid-f9947.firebasestorage.app",
  messagingSenderId: "315125553793",
  appId: "1:315125553793:web:af4ac3618e0531fa190b80",
  measurementId: "G-0EQQ0JW6X1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Firestore
const db = getFirestore(app);

//export auth to be used in other files
export const auth = getAuth(app);

//export db to be used in other files
export { db };