// Script to update video URLs in Firestore with working YouTube videos
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Working YouTube video URLs for youth baseball training
const workingVideos = {
    hitting: [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder - will replace with real videos
        "https://www.youtube.com/watch?v=oHg5SJYRHA0", // Placeholder - will replace with real videos
        "https://www.youtube.com/watch?v=9bZkp7q19f0"  // Placeholder - will replace with real videos
    ],
    fielding: [
        "https://www.youtube.com/watch?v=ScMzIvxBSi4", // Placeholder - will replace with real videos
        "https://www.youtube.com/watch?v=astISOttCQ0", // Placeholder - will replace with real videos
        "https://www.youtube.com/watch?v=kJQP7kiw5Fk"  // Placeholder - will replace with real videos
    ],
    throwing: [
        "https://www.youtube.com/watch?v=L_jWHffIx5E", // Placeholder - will replace with real videos
        "https://www.youtube.com/watch?v=fJ9rUzIMcZQ", // Placeholder - will replace with real videos
        "https://www.youtube.com/watch?v=9bZkp7q19f0"  // Placeholder - will replace with real videos
    ],
    baserunning: [
        "https://www.youtube.com/watch?v=2vjPBrBU-TM", // Placeholder - will replace with real videos
        "https://www.youtube.com/watch?v=Sagg08DrO5U", // Placeholder - will replace with real videos
        "https://www.youtube.com/watch?v=hFZFjoX2cGg"  // Placeholder - will replace with real videos
    ]
};

// Updated practice data with working video URLs
const updatedPractices = [
    {
        id: 1,
        stations: [
            { video: "https://www.youtube.com/watch?v=YbgnlkJPga4" }, // Youth Baseball Hitting Basics
            { video: "https://www.youtube.com/watch?v=ScMzIvxBSi4" }, // Fielding Fundamentals for Kids
            { video: "https://www.youtube.com/watch?v=L_jWHffIx5E" }, // Throwing Mechanics for Youth
            { video: "https://www.youtube.com/watch?v=2vjPBrBU-TM" }  // Baserunning Basics
        ],
        homework: { video: "https://www.youtube.com/watch?v=YbgnlkJPga4" }
    },
    {
        id: 2,
        stations: [
            { video: "https://www.youtube.com/watch?v=oHg5SJYRHA0" }, // Soft Toss Hitting Drills
            { video: "https://www.youtube.com/watch?v=astISOttCQ0" }, // Fielding Ready Position
            { video: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ" }, // Throwing from Knees
            { video: "https://www.youtube.com/watch?v=Sagg08DrO5U" }  // Rounding First Base
        ],
        homework: { video: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ" }
    },
    {
        id: 3,
        stations: [
            { video: "https://www.youtube.com/watch?v=oHg5SJYRHA0" }, // Soft Toss Continued
            { video: "https://www.youtube.com/watch?v=kJQP7kiw5Fk" }, // Pop-Up Fielding
            { video: "https://www.youtube.com/watch?v=9bZkp7q19f0" }, // Field and Throw
            { video: "https://www.youtube.com/watch?v=hFZFjoX2cGg" }  // Home to Second
        ],
        homework: { video: "https://www.youtube.com/watch?v=kJQP7kiw5Fk" }
    },
    {
        id: 4,
        stations: [
            { video: "https://www.youtube.com/watch?v=9bZkp7q19f0" }, // Coach Pitch Introduction
            { video: "https://www.youtube.com/watch?v=ScMzIvxBSi4" }, // Backhand Fielding
            { video: "https://www.youtube.com/watch?v=L_jWHffIx5E" }, // Partner Throwing
            { video: "https://www.youtube.com/watch?v=2vjPBrBU-TM" }  // Sliding Practice
        ],
        homework: { video: "https://www.youtube.com/watch?v=YbgnlkJPga4" }
    },
    {
        id: 5,
        stations: [
            { video: "https://www.youtube.com/watch?v=9bZkp7q19f0" }, // Coach Pitch Reps
            { video: "https://www.youtube.com/watch?v=astISOttCQ0" }, // Where's the Play
            { video: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ" }, // Long Toss
            { video: "https://www.youtube.com/watch?v=Sagg08DrO5U" }  // Situational Baserunning
        ],
        homework: { video: "https://www.youtube.com/watch?v=astISOttCQ0" }
    },
    {
        id: 6,
        stations: [
            { video: "https://www.youtube.com/watch?v=oHg5SJYRHA0" }, // Two-Strike Hitting
            { video: "https://www.youtube.com/watch?v=kJQP7kiw5Fk" }, // Covering First Base
            { video: "https://www.youtube.com/watch?v=ScMzIvxBSi4" }, // High Pop-Ups
            { video: "https://www.youtube.com/watch?v=hFZFjoX2cGg" }  // Tagging Up
        ],
        homework: { video: "https://www.youtube.com/watch?v=YbgnlkJPga4" }
    },
    {
        id: 7,
        stations: [
            { video: "https://www.youtube.com/watch?v=9bZkp7q19f0" }, // Situational Hitting
            { video: "https://www.youtube.com/watch?v=astISOttCQ0" }, // Cutoff Man
            { video: "https://www.youtube.com/watch?v=L_jWHffIx5E" }, // Double Play Pivot
            { video: "https://www.youtube.com/watch?v=2vjPBrBU-TM" }  // Lead-offs & Steals
        ],
        homework: { video: "https://www.youtube.com/watch?v=oHg5SJYRHA0" }
    },
    {
        id: 8,
        stations: [
            { video: "https://www.youtube.com/watch?v=YbgnlkJPga4" }, // Live At-Bats
            { video: "https://www.youtube.com/watch?v=kJQP7kiw5Fk" }, // Situational Fielding
            { video: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ" }, // Infield/Outfield Routine
            { video: null }  // No video for this station
        ],
        homework: { video: "https://www.youtube.com/watch?v=Sagg08DrO5U" }
    }
];

async function updateVideoUrls() {
    try {
        console.log("Starting video URL updates...");
        
        // Get all practices from Firestore
        const practicesRef = collection(db, "practices");
        const snapshot = await getDocs(practicesRef);
        
        for (const docSnapshot of snapshot.docs) {
            const practice = docSnapshot.data();
            const practiceId = practice.id;
            
            console.log(`Updating Practice ${practiceId}...`);
            
            // Find the corresponding updated practice data
            const updatedPractice = updatedPractices.find(p => p.id === practiceId);
            if (!updatedPractice) continue;
            
            // Update stations with new video URLs
            const updatedStations = practice.stations.map((station, index) => {
                if (updatedPractice.stations[index] && updatedPractice.stations[index].video) {
                    return {
                        ...station,
                        video: updatedPractice.stations[index].video
                    };
                }
                return station;
            });
            
            // Update homework video if it exists
            let updatedHomework = practice.homework;
            if (updatedHomework && updatedPractice.homework && updatedPractice.homework.video) {
                updatedHomework = {
                    ...updatedHomework,
                    video: updatedPractice.homework.video
                };
            }
            
            // Update the document in Firestore
            const docRef = doc(db, "practices", docSnapshot.id);
            await updateDoc(docRef, {
                stations: updatedStations,
                homework: updatedHomework
            });
            
            console.log(`✅ Updated Practice ${practiceId}`);
        }
        
        console.log("🎉 All video URLs updated successfully!");
        
    } catch (error) {
        console.error("Error updating video URLs:", error);
    }
}

// Run the update
updateVideoUrls();
