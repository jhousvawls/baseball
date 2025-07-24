// Browser Console Script to Update Practice Timing
// Copy and paste this into the browser console on the live site

console.log('🔧 Starting practice timing updates...');

// Import Firebase modules (these should already be loaded on the page)
const { getFirestore, collection, getDocs, doc, updateDoc } = window.firebase;

// Get the existing Firebase app instance
const db = getFirestore();

// Updated timing structure
const timingUpdates = {
  stationTime: 35,
  stationInstructions: "4 stations, 8-9 minutes each. Focus on fun and participation over perfection.",
  totalTime: 60
};

async function updateAllPractices() {
  try {
    console.log('📚 Loading practices from database...');
    
    // Get all practices
    const practicesRef = collection(db, "practices");
    const snapshot = await getDocs(practicesRef);
    
    if (snapshot.empty) {
      console.log('❌ No practices found in database');
      return;
    }
    
    console.log(`📋 Found ${snapshot.size} practices to update`);
    
    // Update each practice
    for (const docSnapshot of snapshot.docs) {
      const practiceData = docSnapshot.data();
      const practiceId = practiceData.id;
      const practiceTitle = practiceData.title;
      
      console.log(`🔄 Updating Practice ${practiceId}: ${practiceTitle}`);
      
      // Prepare updates
      const updates = {
        stationTime: timingUpdates.stationTime,
        stationInstructions: timingUpdates.stationInstructions,
        totalTime: timingUpdates.totalTime,
        finisher: {
          ...practiceData.finisher,
          duration: 15
        },
        wrapup: {
          ...practiceData.wrapup,
          duration: 5
        }
      };
      
      // Update the document
      await updateDoc(docSnapshot.ref, updates);
      console.log(`✅ Updated Practice ${practiceId}`);
    }
    
    console.log('🎉 ALL PRACTICES UPDATED SUCCESSFULLY!');
    console.log('📊 New timing structure:');
    console.log('   • Warmup: 5 minutes');
    console.log('   • Skill Stations: 35 minutes (8-9 mins each)');
    console.log('   • Game (Finisher): 15 minutes');
    console.log('   • Team Huddle & High Fives: 5 minutes');
    console.log('   • Total: 60 minutes');
    console.log('');
    console.log('🔄 Refresh the page to see the updated timing!');
    
  } catch (error) {
    console.error('❌ Error updating practices:', error);
  }
}

// Run the update
updateAllPractices();
