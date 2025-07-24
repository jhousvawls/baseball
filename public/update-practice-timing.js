const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You'll need to set up service account credentials
const serviceAccount = {
  // Add your Firebase service account key here
  // This would typically be loaded from environment variables or a service account file
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'baseball-practice-generator'
});

const db = admin.firestore();

// Updated practice timing structure
const timingUpdates = {
  stationTime: 35,
  stationInstructions: "4 stations, 8-9 minutes each. Focus on fun and participation over perfection.",
  finisher: {
    duration: 15
  },
  wrapup: {
    duration: 5
  },
  totalTime: 60
};

async function updatePracticeTiming() {
  try {
    console.log('Starting practice timing updates...');
    
    // Get all practices
    const practicesRef = db.collection('practices');
    const snapshot = await practicesRef.get();
    
    if (snapshot.empty) {
      console.log('No practices found in database');
      return;
    }
    
    const batch = db.batch();
    let updateCount = 0;
    
    snapshot.forEach((doc) => {
      const practiceData = doc.data();
      const practiceId = practiceData.id;
      
      console.log(`Updating Practice ${practiceId}: ${practiceData.title}`);
      
      // Update timing fields
      const updates = {
        stationTime: timingUpdates.stationTime,
        stationInstructions: timingUpdates.stationInstructions,
        totalTime: timingUpdates.totalTime,
        'finisher.duration': timingUpdates.finisher.duration,
        'wrapup.duration': timingUpdates.wrapup.duration
      };
      
      batch.update(doc.ref, updates);
      updateCount++;
    });
    
    // Commit all updates
    await batch.commit();
    
    console.log(`✅ Successfully updated ${updateCount} practices with correct timing:`);
    console.log('- Warmup: 5 minutes');
    console.log('- Skill Stations: 35 minutes');
    console.log('- Game (Finisher): 15 minutes');
    console.log('- Team Huddle & High Fives: 5 minutes');
    console.log('- Total: 60 minutes');
    
  } catch (error) {
    console.error('Error updating practice timing:', error);
  } finally {
    admin.app().delete();
  }
}

// Run the update
updatePracticeTiming();
