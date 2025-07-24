// Script to create a test super admin user for database updates
// This script creates both the Firebase Auth user and adds them to authorized_coaches

console.log('🔧 Creating test super admin user...');

// Firebase modules should be available on the page
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = window.firebase;
const { getFirestore, collection, addDoc, setDoc, doc } = window.firebase;

const auth = getAuth();
const db = getFirestore();

// Test admin credentials
const TEST_ADMIN = {
  email: 'john@ahsodesigns.com',
  password: 'TestAdmin2025!',
  displayName: 'Test Super Admin'
};

async function createTestSuperAdmin() {
  try {
    console.log('👤 Creating Firebase Auth user...');
    
    // Try to create the user account
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, TEST_ADMIN.email, TEST_ADMIN.password);
      console.log('✅ Firebase Auth user created successfully');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️ User already exists, signing in instead...');
        userCredential = await signInWithEmailAndPassword(auth, TEST_ADMIN.email, TEST_ADMIN.password);
        console.log('✅ Signed in to existing user');
      } else {
        throw error;
      }
    }
    
    console.log('📝 Adding to authorized coaches collection...');
    
    // Add to authorized_coaches collection
    const coachData = {
      email: TEST_ADMIN.email,
      displayName: TEST_ADMIN.displayName,
      photoURL: null,
      addedBy: 'system',
      addedAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
      isSuperAdmin: true
    };
    
    // Use setDoc to ensure we can overwrite if it exists
    await setDoc(doc(db, "authorized_coaches", userCredential.user.uid), coachData);
    
    console.log('🎉 TEST SUPER ADMIN CREATED SUCCESSFULLY!');
    console.log('📧 Email:', TEST_ADMIN.email);
    console.log('🔑 Password:', TEST_ADMIN.password);
    console.log('');
    console.log('🚀 You can now use these credentials to:');
    console.log('   1. Sign into the admin panel');
    console.log('   2. Edit practices directly');
    console.log('   3. Update timing in the database');
    console.log('');
    console.log('⚠️ Remember: This is a test account for development only!');
    
    return userCredential.user;
    
  } catch (error) {
    console.error('❌ Error creating test admin:', error);
    console.log('');
    console.log('🔍 Common issues:');
    console.log('   • Make sure you\'re on the live site');
    console.log('   • Check Firebase console for authentication settings');
    console.log('   • Verify Firestore security rules allow writes');
  }
}

// Run the creation
createTestSuperAdmin();
