// @ts-nocheck
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
apiKey: "AIzaSyCKKGVVYpyqdXOFWrf3L5SJoZVTyaKGYfw",
authDomain: "newproject-1acc8.firebaseapp.com",
projectId: "newproject-1acc8",
storageBucket: "newproject-1acc8.firebasestorage.app",
messagingSenderId: "333632590723",
appId: "1:333632590723:web:c7ff689f6ee67684999cb6",
measurementId: "G-JHFBYP5DG5" 
              
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
  // Use long-polling to avoid WebChannel 400 issues on some networks/proxies
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
    // optional: tweak if you still see issues
    // longPollingOptions: { timeoutSeconds: 30 },
  });
  storage = getStorage(app);
}

export { auth, db, storage, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut };