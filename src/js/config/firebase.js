// Firebase Configuration Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbbWiG70w1gSatqmvlEM-0rQwiunQWZcI",
    authDomain: "baseball-practice-generator.firebaseapp.com",
    projectId: "baseball-practice-generator",
    storageBucket: "baseball-practice-generator.firebasestorage.app",
    messagingSenderId: "662143680258",
    appId: "1:662143680258:web:bdb81ba1a47e738a1bcc1b"
};

// Initialize Firebase
let app, auth, db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase Initialized Successfully.");
} catch (error) {
    console.error("CRITICAL: Error initializing Firebase.", error);
    throw new Error("Firebase initialization failed.");
}

// Export Firebase instances
export { auth, db };
export default app;
