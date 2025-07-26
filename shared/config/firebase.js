// Shared Firebase Configuration for Coach's Dugout
// Used by both the marketing site and practice app

const firebaseConfig = {
  apiKey: "AIzaSyDbbWiG70w1gSatqmvlEM-0rQwiunQWZcI",
  authDomain: "baseball-practice-generator.firebaseapp.com",
  projectId: "baseball-practice-generator",
  storageBucket: "baseball-practice-generator.firebasestorage.app",
  messagingSenderId: "662143680258",
  appId: "1:662143680258:web:bdb81ba1a47e738a1bcc1b"
};

// Super admin email - update this to your email
const SUPER_ADMIN_EMAIL = 'admin@braves-practice.com';

// Export for use in both marketing site and practice app
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = { firebaseConfig, SUPER_ADMIN_EMAIL };
} else {
  // Browser environment
  window.firebaseConfig = firebaseConfig;
  window.SUPER_ADMIN_EMAIL = SUPER_ADMIN_EMAIL;
}
