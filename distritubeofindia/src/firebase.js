import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
           apiKey: "AIzaSyDIdf3EzzDmhXL-5TiPfwgDmH3reB3MkEE",
           authDomain: "distritubeofindia.firebaseapp.com",
            projectId: "distritubeofindia",
            storageBucket: "distritubeofindia.firebasestorage.app",
            messagingSenderId: "1090696562674",
            appId: "1:1090696562674:web:d235db8dd9d374ed3b4d6b",
            measurementId: "G-DBHTGXSDKH"
};

// Validate required env vars. If missing, don't crash — export nulls so UI can render
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (missingKeys.length > 0) {
  // eslint-disable-next-line no-console
  console.warn('Firebase env vars missing. UI will render but Firebase features are disabled until .env.local is set. Missing:', missingKeys);
} else {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { auth, db, storage, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut };