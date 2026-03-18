import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdQk0U8AyccBbqP7L-R2Urxs7T8KDUHmM",
  authDomain: "chinnu-tex-admin.web.app",
  projectId: "chinnu-textiles",
  storageBucket: "chinnu-textiles.firebasestorage.app",
  messagingSenderId: "772001051450",
  appId: "1:772001051450:web:06ffff72a56433274e9603",
  measurementId: "G-S6QME3JGFL"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
