// Complete Database Fix Script
// Run this in the browser console on https://baseball-practice-generator.web.app

console.log('🚀 Starting complete database fix...');

// Import Firebase modules from the global scope
const { getFirestore, collection, getDocs, doc, updateDoc, setDoc } = window.firebase;
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = window.firebase;

const db = getFirestore();
const auth = getAuth();

// Test admin credentials
const TEST_ADMIN = {
  email: 'john@ahsodesigns.com',
  password: 'TestAdmin2025!',
  displayName: 'Test Super Admin'
};

// Step 1: Create test admin user
async function createTestAdmin() {
  console.log('👤 Creating test super admin user...');
  
  try {
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
    
    await setDoc(doc(db, "authorized_coaches", userCredential.user.uid), coachData);
    console.log('✅ Added to authorized coaches collection');
    
    return userCredential.user;
    
  } catch (error) {
    console.error('❌ Error creating test admin:', error);
    throw error;
  }
}

// Step 2: Update practice timing
async function updatePracticeTiming() {
  console.log('⏰ Updating practice timing...');
  
  try {
    // Get all practices
    const practicesRef = collection(db, "practices");
    const snapshot = await getDocs(practicesRef);
    
    if (snapshot.empty) {
      console.log('❌ No practices found in database');
      return;
    }
    
    console.log(`📋 Found ${snapshot.size} practices to update`);
    
    // Update each practice
    let updateCount = 0;
    for (const docSnapshot of snapshot.docs) {
      const practiceData = docSnapshot.data();
      const practiceId = practiceData.id;
      const practiceTitle = practiceData.title;
      
      console.log(`🔄 Updating Practice ${practiceId}: ${practiceTitle}`);
      
      // Calculate correct timing
      const updates = {
        stationTime: 35,
        stationInstructions: "4 stations, 8-9 minutes each. Focus on fun and participation over perfection.",
        totalTime: 60,
        finisher: {
          ...practiceData.finisher,
          duration: 15
        },
        wrapup: {
          ...practiceData.wrapup,
          duration: 5
        },
        // Add tracking fields
        lastUpdatedAt: new Date(),
        lastUpdatedBy: 'Database Fix Script'
      };
      
      // Update the document
      await updateDoc(docSnapshot.ref, updates);
      console.log(`✅ Updated Practice ${practiceId} - New total: 60 minutes`);
      updateCount++;
    }
    
    console.log(`🎉 Successfully updated ${updateCount} practices!`);
    return updateCount;
    
  } catch (error) {
    console.error('❌ Error updating practice timing:', error);
    throw error;
  }
}

// Main execution function
async function fixDatabase() {
  try {
    console.log('🔧 Step 1: Creating test super admin...');
    await createTestAdmin();
    
    console.log('🔧 Step 2: Updating practice timing...');
    const updateCount = await updatePracticeTiming();
    
    console.log('');
    console.log('🎉 DATABASE FIX COMPLETE!');
    console.log('');
    console.log('📊 Results:');
    console.log(`   ✅ Test admin created: ${TEST_ADMIN.email}`);
    console.log(`   ✅ Practices updated: ${updateCount}`);
    console.log('');
    console.log('🔑 Admin Credentials:');
    console.log(`   📧 Email: ${TEST_ADMIN.email}`);
    console.log(`   🔑 Password: ${TEST_ADMIN.password}`);
    console.log('');
    console.log('📋 New Practice Timing (All 8 Practices):');
    console.log('   • Warmup: 5 minutes');
    console.log('   • Skill Stations: 35 minutes (8-9 mins each)');
    console.log('   • Game (Finisher): 15 minutes');
    console.log('   • Team Huddle & High Fives: 5 minutes');
    console.log('   • Total: 60 minutes ✅');
    console.log('');
    console.log('🔄 Refresh the page to see the updated timing!');
    console.log('🔐 You can now login to admin panel with the credentials above');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
    console.log('');
    console.log('🔍 Troubleshooting:');
    console.log('   • Make sure you\'re on the live site');
    console.log('   • Check browser console for detailed errors');
    console.log('   • Verify Firebase permissions');
  }
}

// Run the complete fix
fixDatabase();
