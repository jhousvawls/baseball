// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDbbWiG70w1gSatqmvlEM-0rQwiunQWZcI",
  authDomain: "baseball-practice-generator.firebaseapp.com",
  projectId: "baseball-practice-generator",
  storageBucket: "baseball-practice-generator.firebasestorage.app",
  messagingSenderId: "662143680258",
  appId: "1:662143680258:web:bdb81ba1a47e738a1bcc1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Super admin email - update this to your email
export const SUPER_ADMIN_EMAIL = 'john.housholder@gmail.com';

export default app;
