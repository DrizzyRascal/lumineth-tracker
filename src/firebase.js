import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0uoSaKqONh_aPG0CUDqErucqnNQ_rEWc",
  authDomain: "lumineth-tracker.firebaseapp.com",
  projectId: "lumineth-tracker",
  storageBucket: "lumineth-tracker.firebasestorage.app",
  messagingSenderId: "13093857791",
  appId: "1:13093857791:web:d71eca3ee481be1eb3dfca",
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db             = getFirestore(app);
