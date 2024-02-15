import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcMwU5BMpli9tRxK2uqk2zl9E_q-CYS6k",
  authDomain: "viecvat247-ce6fd.firebaseapp.com",
  projectId: "viecvat247-ce6fd",
  storageBucket: "viecvat247-ce6fd.appspot.com",
  messagingSenderId: "674417819382",
  appId: "1:674417819382:web:85dc5823828723e8d976d7",
  measurementId: "G-51TDWH8LQ7",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === "localhost") {
  // auth.useEmulator('http://localhost:9099');
  // db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;
