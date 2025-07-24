// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, deleteDoc, onSnapshot, setDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Import application modules
import { FIREBASE_CONFIG } from '../js/config/firebase.js';
import { showConfirmation } from '../js/modules/confirmation.js';
import { videoSearchManager } from '../js/modules/videoSearch.js';
import { aiAssistant } from '../js/modules/aiAssistant.js';
import { SUPER_ADMIN_EMAIL, YOUTUBE_API_KEY, YOUTUBE_API_BASE_URL } from '../js/utils/constants.js';
import { extractVideoId, formatDate, getTimeAgo, getErrorMessage, showAdminError } from '../js/utils/helpers.js';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// Global state
let practices = [];
let currentPractice = 1;
let isAdmin = false;
let isSuperAdmin = false;
let currentUser = null;
let currentEditingPractice = null;
let currentVideoSearchTarget = null;
let videoSearchCache = new Map();
let authorizedCoaches = [];
let practiceChanges = [];
let csvUploadData = null;

console.log("Firebase Initialized Successfully.");

// --- AUTHENTICATION ---
function initializeAuth() {
    console.log("Initializing authentication...");
    
    // Check for redirect result first
    getRedirectResult(auth)
        .then((result) => {
            if (result) {
                console.log('Google sign-in redirect successful:', result.user);
                handleAuthSuccess(result.user);
            }
        })
        .catch((error) => {
            console.error('Redirect result error:', error);
        });
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in:", user.uid);
            currentUser = user;
            handleAuthSuccess(user);
        } else {
            console.log("User is signed out. Attempting anonymous sign-in...");
            signInAnonymously(auth)
                .then(() => {
                    console.log("User is signed in anonymously:", auth.currentUser.uid);
                    currentUser = auth.currentUser;
                })
                .catch((error) => {
                    console.error("Anonymous sign-in failed:", error);
                });
        }
    });
}

async function handleAuthSuccess(user) {
    if (user.email) {
        // Check if user is super admin
        if (user.email === SUPER_ADMIN_EMAIL) {
            isAdmin = true;
            isSuperAdmin = true;
            console.log("Super admin user detected");
            showAdminDashboard();
            return;
        }
        
        // Check if user is authorized coach
        const isAuthorized = await checkCoachAuthorization(user.email);
        if (isAuthorized) {
            isAdmin = true;
            isSuperAdmin = false;
            console.log("Authorized coach detected");
            await updateCoachLastLogin(user.email);
            showAdminDashboard();
            return;
        }
        
        // Fallback for admin email patterns
        if (user.email.includes('admin')) {
            isAdmin = true;
            isSuperAdmin = true;
            console.log("Admin user detected by email pattern");
            showAdminDashboard();
            return;
        }
        
        // If user is not authorized, show error and close modal
        console.log("User not authorized for admin access:", user.email);
        const adminModal = document.getElementById('admin-modal');
        const errorDiv = document.getElementById('admin-error');
        errorDiv.textContent = 'You are not authorized to access the admin panel. Please contact the super admin.';
        errorDiv.classList.remove('hidden');
        
        // Sign out unauthorized user
        setTimeout(() => {
            signOut(auth);
            adminModal.classList.add('hidden');
        }, 3000);
    }
}

async function checkCoachAuthorization(email) {
    try {
        const coachesRef = collection(db, "authorized_coaches");
        const snapshot = await getDocs(coachesRef);
        
        for (const doc of snapshot.docs) {
            const coach = doc.data();
            if (coach.email === email && coach.isActive) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error checking coach authorization:", error);
        return false;
    }
}

async function updateCoachLastLogin(email) {
    try {
        const coachesRef = collection(db, "authorized_coaches");
        const snapshot = await getDocs(coachesRef);
        
        for (const doc of snapshot.docs) {
            const coach = doc.data();
            if (coach.email === email) {
                // Update login time and sync Google profile data
                const updateData = {
                    lastLogin: new Date()
                };
                
                // Sync Google profile data if available
                if (currentUser?.photoURL) {
                    updateData.photoURL = currentUser.photoURL;
                }
                if (currentUser?.displayName) {
                    updateData.googleDisplayName = currentUser.displayName;
                }
                
                await updateDoc(doc.ref, updateData);
                break;
            }
        }
    } catch (error) {
        console.error("Error updating coach last login:", error);
    }
}

// --- DATA LOADING ---
async function loadPractices() {
    try {
        console.log("Loading practices from Firestore...");
        const practicesRef = collection(db, "practices");
        
        onSnapshot(practicesRef, async (snapshot) => {
            console.log("Received update from Firestore.");
            practices = [];
            snapshot.forEach((doc) => {
                const practiceData = { docId: doc.id, ...doc.data() };
                practices.push(practiceData);
            });
            
            practices.sort((a, b) => a.id - b.id);
            console.log(`Loaded ${practices.length} practices`);
            
            // Seed database if empty
            if (practices.length === 0) {
                console.log("No practices found. Seeding database...");
                await seedDatabase();
                return;
            }
            
            renderPracticeSelector();
            if (currentPractice) {
                displayPractice(currentPractice);
            }
            
            if (isAdmin) {
                renderAdminPractices();
            }
        });
    } catch (error) {
        console.error("Error loading practices:", error);
    }
}

async function seedDatabase() {
    const initialPractices = [
        {
            id: 1,
            title: "First Steps",
            totalTime: 60,
            warmup: {
                title: "Welcome Circle",
                desc: "Gather players in a circle. Introduce coaches and players. Explain what baseball is and what we'll do today. Practice saying 'Good job!' and giving high-fives.",
                duration: 5
            },
            stationTime: 35,
            stationInstructions: "Split into 4 groups. Spend 8-9 minutes at each station. Focus on fun and participation over perfection.",
            stations: [
                {
                    name: "Alligator Chomps",
                    desc: "Players sit with legs apart, glove on ground between legs. Coach rolls ball slowly toward glove. Player 'chomps' the ball like an alligator eating. Emphasize keeping eye on ball and using both hands.",
                    video: "https://www.youtube.com/watch?v=example1"
                },
                {
                    name: "Statue Throwing",
                    desc: "Players stand like statues, then 'come alive' to throw. Start 5 feet apart. Focus on stepping toward target and following through. Celebrate every throw that reaches partner.",
                    video: "https://www.youtube.com/watch?v=example2"
                },
                {
                    name: "Tee Ball Swings",
                    desc: "Each player gets 5 swings off tee. Focus on 'squishing the bug' with back foot and hitting the ball, not the tee. Cheer for every contact, no matter where ball goes.",
                    video: "https://www.youtube.com/watch?v=example3"
                },
                {
                    name: "Base Running Parade",
                    desc: "Players line up and run bases one at a time like a parade. Coach stands at each base giving high-fives. Teach them to run through first base, not to it.",
                    video: "https://www.youtube.com/watch?v=example4"
                }
            ],
            finisher: {
                title: "Home Run Derby",
                desc: "Every player gets to hit until they get a 'home run' (any ball that goes past the pitcher). Celebrate each home run with team cheers and high-fives all around.",
                duration: 15
            },
            wrapup: {
                title: "Circle Time",
                desc: "Gather in circle. Ask each player what their favorite part was. Give out stickers or stamps. Remind them when next practice is and that they're all baseball players now!",
                duration: 5
            },
            homework: {
                title: "Play Catch with Family",
                desc: "Practice throwing and catching with a parent, sibling, or friend. Even 5 minutes counts! Focus on watching the ball all the way into your glove.",
                video: "https://www.youtube.com/watch?v=example5"
            }
        },
        {
            id: 2,
            title: "Building Basics",
            totalTime: 60,
            warmup: {
                title: "Baseball Simon Says",
                desc: "Play Simon Says with baseball actions: 'Simon says swing your bat', 'Simon says catch a fly ball', 'Simon says run to first base'. Gets players moving and thinking baseball.",
                duration: 5
            },
            stationTime: 35,
            stationInstructions: "4 stations, 8-9 minutes each. Add more challenge while keeping it fun. Encourage players to help each other.",
            stations: [
                {
                    name: "Bucket Catches",
                    desc: "Coach tosses soft balls underhand into bucket held by player. Start close, move back as they improve. Teaches tracking and hand-eye coordination. Switch roles so everyone gets to toss too.",
                    video: "https://www.youtube.com/watch?v=example6"
                },
                {
                    name: "Step and Throw",
                    desc: "Focus on stepping toward target with opposite foot. Use cones or spots to show where to step. Start close together, gradually increase distance. Celebrate good steps even if throw is off target.",
                    video: "https://www.youtube.com/watch?v=example7"
                },
                {
                    name: "Tee Work Plus",
                    desc: "Hit off tee, but now try to hit ball to different areas. 'Hit it to the moon!' (high), 'Hit it to the worms!' (ground), 'Hit it to grandma!' (right field). Makes hitting directional and fun.",
                    video: "https://www.youtube.com/watch?v=example8"
                },
                {
                    name: "Red Light Green Light Bases",
                    desc: "Players run bases but must freeze on 'red light'. Teaches base running control and listening to coaches. Add 'yellow light' for jogging to increase complexity.",
                    video: "https://www.youtube.com/watch?v=example9"
                }
            ],
            finisher: {
                title: "Beat the Coach",
                desc: "Players try to run around all bases before coach can field a hit ball and touch home plate. Coach should 'struggle' to field balls and run slowly. Every player wins!",
                duration: 15
            },
            wrapup: {
                title: "Skills Check",
                desc: "Quick review: show me your catching position, your throwing step, your batting stance. Give specific praise for improvement since last week.",
                duration: 5
            },
            homework: {
                title: "Wall Ball",
                desc: "Throw a tennis ball against a wall and catch it. Start close to wall, step back as you improve. Great for hand-eye coordination and can be done anywhere!",
                video: "https://www.youtube.com/watch?v=example10"
            }
        },
        {
            id: 3,
            title: "Making Connections",
            totalTime: 60,
            warmup: {
                title: "Partner Stretches",
                desc: "Pair up players for simple stretches. Arm circles, toe touches, gentle twists. Partners help count to 10. Builds teamwork and gets bodies ready for activity.",
                duration: 5
            },
            stationTime: 35,
            stationInstructions: "4 stations, 8-9 minutes each. Focus on connecting skills together. Players should start seeing how catching, throwing, and hitting work together.",
            stations: [
                {
                    name: "Catch and Throw",
                    desc: "Coach rolls ball to player, player fields it and throws to target (cone, bucket, or coach). Connects fielding and throwing. Start with slow rollers, progress to gentle bounces.",
                    video: "https://www.youtube.com/watch?v=example11"
                },
                {
                    name: "Throwing Accuracy",
                    desc: "Set up targets (cones, hula hoops, buckets) at different distances. Players earn points for hitting targets. Make it a team challenge - everyone's points count toward group total.",
                    video: "https://www.youtube.com/watch?v=example12"
                },
                {
                    name: "Hit and Run",
                    desc: "Player hits off tee then runs to first base. Next player fields the ball and throws to coach at first. Introduces the connection between hitting and fielding.",
                    video: "https://www.youtube.com/watch?v=example13"
                },
                {
                    name: "Base Running Signals",
                    desc: "Teach simple signals: thumbs up = run, flat hand = stop, circular motion = keep going. Practice with players running bases and responding to coach signals.",
                    video: "https://www.youtube.com/watch?v=example14"
                }
            ],
            finisher: {
                title: "Scrimmage Simulation",
                desc: "Simple game: hit off tee, run to first, next batter hits and first runner advances. No outs, everyone gets to hit and run. Focus on having fun and moving around bases.",
                duration: 15
            },
            wrapup: {
                title: "Team Cheer",
                desc: "Teach team cheer: '2-4-6-8, who do we appreciate? Braves! Braves! Gooooo Braves!' Practice it together and use it to end every practice from now on.",
                duration: 5
            },
            homework: {
                title: "Underhand Toss",
                desc: "Practice gentle underhand tosses with family member. Focus on smooth, easy motion. This helps with fielding and develops soft hands for catching.",
                video: "https://www.youtube.com/watch?v=example15"
            }
        },
        {
            id: 4,
            title: "Game Awareness",
            totalTime: 60,
            warmup: {
                title: "Baseball Yoga",
                desc: "Simple poses with baseball names: 'Batter's Box' (squat), 'Home Run Swing' (gentle twist), 'Fly Ball Catch' (reach up high). Makes stretching fun and baseball-themed.",
                duration: 5
            },
            stationTime: 35,
            stationInstructions: "4 stations, 8-9 minutes each. Introduce basic game concepts. Players should start understanding what happens in a real game.",
            stations: [
                {
                    name: "Fielding Positions",
                    desc: "Show players where each position stands. Let them try different spots. 'Who wants to be the pitcher?' 'Who wants to guard first base?' Make it about exploring, not perfection.",
                    video: "https://www.youtube.com/watch?v=example16"
                },
                {
                    name: "Force Outs",
                    desc: "Simple drill: runner on first, ground ball hit, field ball and step on second base. Explain that runner is 'out' when we get the ball to the base first. Keep it simple and positive.",
                    video: "https://www.youtube.com/watch?v=example17"
                },
                {
                    name: "Live Pitching Prep",
                    desc: "Coach tosses very soft, slow pitches underhand from close distance. Players practice swinging at moving balls. Focus on watching ball, not on making contact yet.",
                    video: "https://www.youtube.com/watch?v=example18"
                },
                {
                    name: "Situational Base Running",
                    desc: "Practice different scenarios: 'Run on any hit', 'Stop at first base', 'Run home if ball goes past pitcher'. Use cones and verbal cues to guide players.",
                    video: "https://www.youtube.com/watch?v=example19"
                }
            ],
            finisher: {
                title: "Mini Inning",
                desc: "Play one 'inning' where everyone bats once. Mix tee and coach pitch. Focus on running bases and cheering for teammates. No keeping score, just playing baseball!",
                duration: 15
            },
            wrapup: {
                title: "Position Practice",
                desc: "Have each player stand in a different position and wave to the crowd (parents). Explain what each position does in simple terms. Everyone is important!",
                duration: 5
            },
            homework: {
                title: "Watch Baseball",
                desc: "Watch 10 minutes of a baseball game on TV or online with family. Count how many times players catch the ball. Talk about what you see with parents.",
                video: "https://www.youtube.com/watch?v=example20"
            }
        },
        {
            id: 5,
            title: "Skill Refinement",
            totalTime: 60,
            warmup: {
                title: "Dynamic Movement",
                desc: "High knees to first base, butt kicks to second, side shuffles to third, backwards jog home. Gets players moving in different ways while touring the bases.",
                duration: 5
            },
            stationTime: 35,
            stationInstructions: "4 stations, 8-9 minutes each. Refine skills learned in previous practices. Add more challenge and introduce new concepts.",
            stations: [
                {
                    name: "Ground Ball Fundamentals",
                    desc: "Proper fielding position: knees bent, glove down, watch ball into glove. Coach rolls balls directly at players first, then slightly to sides. Emphasize 'two hands for beginners'.",
                    video: "https://www.youtube.com/watch?v=example21"
                },
                {
                    name: "Throwing Mechanics",
                    desc: "Break down throwing: point glove at target, step with opposite foot, throw over the top, follow through. Use 'point, step, throw' as verbal cue. Practice without ball first.",
                    video: "https://www.youtube.com/watch?v=example22"
                },
                {
                    name: "Batting Stance",
                    desc: "Establish consistent batting stance: feet shoulder-width apart, knees slightly bent, hands together on bat. Practice 'load and swing' without hitting ball. Add tee work after stance is set.",
                    video: "https://www.youtube.com/watch?v=example23"
                },
                {
                    name: "Catching Fly Balls",
                    desc: "Start with very short tosses. Teach 'basket catch' (catching ball at waist level). Progress to slightly higher tosses. Use tennis balls or safety balls to reduce fear.",
                    video: "https://www.youtube.com/watch?v=example24"
                }
            ],
            finisher: {
                title: "Skills Showcase",
                desc: "Each player demonstrates one skill they've improved. Other players cheer and give compliments. Builds confidence and celebrates individual progress.",
                duration: 15
            },
            wrapup: {
                title: "Goal Setting",
                desc: "Ask each player what they want to work on next week. Write goals on index cards for them to take home. Keep goals simple and achievable.",
                duration: 5
            },
            homework: {
                title: "Mirror Practice",
                desc: "Practice batting stance and swing in front of mirror. Focus on keeping head still and watching imaginary ball. Parents can help check form.",
                video: "https://www.youtube.com/watch?v=example25"
            }
        },
        {
            id: 6,
            title: "Team Play",
            totalTime: 60,
            warmup: {
                title: "Team Building Circle",
                desc: "Players stand in circle and share one thing they like about the teammate to their right. Builds team chemistry and positive communication.",
                duration: 5
            },
            stationTime: 35,
            stationInstructions: "4 stations, 8-9 minutes each. Focus on working together and understanding team concepts. Introduce more game-like situations.",
            stations: [
                {
                    name: "Relay Races",
                    desc: "Teams compete in baseball-themed relays: base running relay, ball passing relay, equipment gathering relay. Emphasizes teamwork and hustle.",
                    video: "https://www.youtube.com/watch?v=example26"
                },
                {
                    name: "Backing Up",
                    desc: "Teach concept of backing up teammates. When ball is thrown to first base, second baseman backs up. Practice with simple scenarios and lots of encouragement.",
                    video: "https://www.youtube.com/watch?v=example27"
                },
                {
                    name: "Communication Drills",
                    desc: "Practice calling for fly balls: 'Mine! Mine! Mine!' and 'I got it!' Teach players to talk to each other on the field. Make it loud and fun.",
                    video: "https://www.youtube.com/watch?v=example28"
                },
                {
                    name: "Situational Hitting",
                    desc: "Give hitting scenarios: 'Try to hit it to the right side', 'Hit a ground ball', 'Hit it in the air'. Helps players think about hitting with purpose.",
                    video: "https://www.youtube.com/watch?v=example29"
                }
            ],
            finisher: {
                title: "Team Challenge",
                desc: "Whole team works together to complete challenges: everyone must catch one fly ball, team must make 10 good throws in a row, etc. Celebrate team success!",
                duration: 15
            },
            wrapup: {
                title: "Team Huddle",
                desc: "Form team huddle like real baseball teams. Practice team cheer and discuss what makes a good teammate. End with group high-five.",
                duration: 5
            },
            homework: {
                title: "Teach Someone",
                desc: "Teach a family member or friend one baseball skill you've learned. Teaching others helps reinforce your own learning and builds confidence.",
                video: "https://www.youtube.com/watch?v=example30"
            }
        },
        {
            id: 7,
            title: "Game Situations",
            totalTime: 60,
            warmup: {
                title: "Situation Stretches",
                desc: "Stretch while discussing game situations: 'Stretch like you're reaching for a high fly ball', 'Bend like you're fielding a ground ball'. Combines physical and mental preparation.",
                duration: 5
            },
            stationTime: 35,
            stationInstructions: "4 stations, 8-9 minutes each. Practice real game situations. Players should start thinking like baseball players and making decisions.",
            stations: [
                {
                    name: "Rundown Drills",
                    desc: "Simple rundown between bases. Teach runners to pick a base and go for it. Teach fielders to work together. Keep it fun - runners can be 'sneaky' and fielders can be 'detectives'.",
                    video: "https://www.youtube.com/watch?v=example31"
                },
                {
                    name: "Bunt Defense",
                    desc: "Show what a bunt is and how to field it. Practice charging slow rollers and making quick throws. Emphasize getting one out rather than trying for two.",
                    video: "https://www.youtube.com/watch?v=example32"
                },
                {
                    name: "Live Pitching",
                    desc: "Coach pitches slowly underhand from short distance. Focus on contact, not power. Celebrate any contact with bat. Mix in tee work for struggling hitters.",
                    video: "https://www.youtube.com/watch?v=example33"
                },
                {
                    name: "Defensive Positioning",
                    desc: "Practice moving to different positions based on game situations. 'Infield in', 'Outfield back', 'Everyone shift left'. Make it like a dance with verbal cues.",
                    video: "https://www.youtube.com/watch?v=example34"
                }
            ],
            finisher: {
                title: "Scrimmage Game",
                desc: "Play 2-3 innings of real baseball with modified rules: everyone bats each inning, coach helps with pitching, focus on fun over competition. Keep it loose and encouraging.",
                duration: 15
            },
            wrapup: {
                title: "Game Reflection",
                desc: "Discuss what happened in scrimmage: good plays, good effort, good teamwork. Ask players what they learned and what they want to practice more.",
                duration: 5
            },
            homework: {
                title: "Mental Practice",
                desc: "Before bed, imagine yourself making a great play in baseball. Visualization helps with confidence and skill development. Dream about baseball success!",
                video: "https://www.youtube.com/watch?v=example35"
            }
        },
        {
            id: 8,
            title: "Championship Ready",
            totalTime: 60,
            warmup: {
                title: "Championship Warm-up",
                desc: "Full team warm-up like the big leagues: jogging, arm circles, practice swings, fielding positions. Players should feel like real baseball players preparing for a big game.",
                duration: 5
            },
            stationTime: 35,
            stationInstructions: "4 stations, 8-9 minutes each. Put it all together. Players should demonstrate all skills learned and show confidence in game situations.",
            stations: [
                {
                    name: "Advanced Fielding",
                    desc: "Field ground balls and make throws to different bases. Practice double plays (field ball, step on base, throw to first). Emphasize quick decisions and accurate throws.",
                    video: "https://www.youtube.com/watch?v=example36"
                },
                {
                    name: "Hitting for Contact",
                    desc: "Focus on making consistent contact. Mix tee work, soft toss, and live pitching. Teach players to 'protect the plate' and swing at good pitches.",
                    video: "https://www.youtube.com/watch?v=example37"
                },
                {
                    name: "Base Running Strategy",
                    desc: "Practice reading the ball off the bat: run on ground balls, tag up on fly balls, advance on wild throws. Teach smart, aggressive base running.",
                    video: "https://www.youtube.com/watch?v=example38"
                },
                {
                    name: "Pitching Basics",
                    desc: "Let interested players try pitching. Focus on throwing strikes, not speed. Teach simple wind-up and follow-through. Everyone gets to try if they want.",
                    video: "https://www.youtube.com/watch?v=example39"
                }
            ],
            finisher: {
                title: "Championship Game",
                desc: "Play full scrimmage game with all rules. Keep score if players want, but emphasize effort and improvement over winning. Celebrate great plays by both teams.",
                duration: 15
            },
            wrapup: {
                title: "Season Celebration",
                desc: "Celebrate the season! Give out certificates, share favorite memories, take team photo. Remind players they are now real baseball players and should be proud of their progress.",
                duration: 5
            },
            homework: {
                title: "Keep Playing",
                desc: "Continue playing baseball! Join a local league, play catch regularly, watch games on TV. Baseball is a lifelong sport - this is just the beginning of your baseball journey!",
                video: "https://www.youtube.com/watch?v=example40"
            }
        }
    ];

    try {
        for (const practice of initialPractices) {
            await setDoc(doc(db, "practices", practice.id.toString()), practice);
        }
        console.log("Database seeded successfully with 8 practices");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

// --- UI RENDERING ---
function renderPracticeSelector() {
    const selector = document.getElementById('practice-selector');
    if (!selector) return;
    
    selector.innerHTML = '';
    
    for (let i = 1; i <= 8; i++) {
        const button = document.createElement('button');
        button.className = `practice-btn w-full py-3 px-4 rounded-lg font-bold text-lg ${
            i === currentPractice ? 'active' : 'bg-gray-200 text-gray-700'
        }`;
        button.textContent = i;
        button.onclick = () => selectPractice(i);
        selector.appendChild(button);
    }
}

function selectPractice(practiceNumber) {
    currentPractice = practiceNumber;
    renderPracticeSelector();
    displayPractice(practiceNumber);
}

function displayPractice(practiceNumber) {
    const practice = practices.find(p => p.id === practiceNumber);
    const display = document.getElementById('practice-plan-display');
    
    if (!practice) {
        display.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-baseball-ball text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-600 mb-2">Practice ${practiceNumber}</h3>
                <p class="text-gray-500">Practice plan not available yet.</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl sm:text-3xl font-bold text-braves-navy">${practice.title}</h2>
            <div class="flex items-center space-x-3 no-print">
                <span class="text-sm text-gray-600">Total Time: ${practice.totalTime} Minutes</span>
                <button onclick="printPractice()" class="bg-braves-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all">
                    <i class="fas fa-print mr-2"></i>Print Practice
                </button>
            </div>
        </div>
    `;

    // Warm-up section
    if (practice.warmup) {
        html += `
            <div class="practice-section">
                <div class="section-header">
                    <i class="fas fa-running section-icon"></i>
                    <h3 class="section-title">${practice.warmup.title}</h3>
                    <span class="section-duration">${practice.warmup.duration} mins</span>
                </div>
                <div class="section-content">
                    <p class="section-description">${practice.warmup.desc}</p>
                </div>
            </div>
        `;
    }

    // Stations section
    if (practice.stations && practice.stations.length > 0) {
        html += `
            <div class="mb-8">
                <h3 class="text-xl font-bold text-braves-navy mb-2 flex items-center">
                    <i class="fas fa-baseball-ball mr-3 text-braves-red"></i>
                    Skill Stations (${practice.stationTime} mins)
                </h3>
                <p class="text-gray-600 mb-6">${practice.stationInstructions}</p>
        `;

        practice.stations.forEach((station, index) => {
            html += `
                <div class="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                    <h4 class="text-lg font-bold text-gray-800 mb-3">${station.name}</h4>
                    <p class="text-gray-700 mb-4">${station.desc}</p>
                    ${station.video ? `
                        <button onclick="openVideo('${station.video}', '${station.name}')" 
                                class="video-link bg-braves-navy text-white px-4 py-2 rounded text-sm font-semibold hover:bg-braves-red transition-all">
                            <i class="fas fa-play mr-2"></i>Watch Station Drill
                        </button>
                    ` : ''}
                </div>
            `;
        });

        html += `
            </div>
        `;
    }

    // Fun Finisher section
    if (practice.finisher) {
        html += `
            <div class="practice-section">
                <div class="section-header">
                    <i class="fas fa-trophy section-icon"></i>
                    <h3 class="section-title">${practice.finisher.title}</h3>
                    <span class="section-duration">${practice.finisher.duration} mins</span>
                </div>
                <div class="section-content">
                    <p class="section-description">${practice.finisher.desc}</p>
                </div>
            </div>
        `;
    }

    // Wrap-up section
    if (practice.wrapup) {
        html += `
            <div class="practice-section">
                <div class="section-header">
                    <i class="fas fa-users section-icon"></i>
                    <h3 class="section-title">${practice.wrapup.title}</h3>
                    <span class="section-duration">${practice.wrapup.duration} mins</span>
                </div>
                <div class="section-content">
                    <p class="section-description">${practice.wrapup.desc}</p>
                </div>
            </div>
        `;
    }

    // Parent Homework section
    if (practice.homework) {
        html += `
            <div class="homework-section">
                <div class="homework-divider"></div>
                <div class="practice-section">
                    <div class="section-header">
                        <i class="fas fa-home section-icon"></i>
                        <h3 class="section-title">Parent Homework</h3>
                    </div>
                    <h4 class="font-semibold text-gray-800 mb-3">${practice.homework.title}</h4>
                    <p class="text-gray-700 mb-4">${practice.homework.desc}</p>
                    ${practice.homework.video ? `
                        <button onclick="openVideo('${practice.homework.video}', '${practice.homework.title}')" 
                                class="homework-video-btn">
                            <i class="fas fa-lightbulb mr-2"></i>Watch Homework Drill
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    display.innerHTML = html;
    display.className = 'bg-white p-4 sm:p-6 rounded-2xl shadow-lg transition-all duration-500 min-h-[300px] animate-fade-in';
}

// --- VIDEO FUNCTIONALITY ---
function openVideo(videoUrl, title) {
    if (!videoUrl) return;
    
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
        alert('Invalid video URL');
        return;
    }
    
    const modal = document.getElementById('video-modal');
    const titleElement = document.getElementById('video-title');
    const container = document.getElementById('video-container');
    
    titleElement.textContent = title;
    container.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
    `;
    
    modal.classList.remove('hidden');
}

function closeVideo() {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('video-container');
    
    container.innerHTML = '';
    modal.classList.add('hidden');
}

// --- ADMIN FUNCTIONALITY ---
function showAdminDashboard() {
    const adminDashboard = document.getElementById('admin-dashboard');
    const adminModal = document.getElementById('admin-modal');
    
    adminModal.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    
    // Show/hide coaches tab based on super admin status
    const coachesTab = document.getElementById('coaches-tab');
    if (coachesTab) {
        coachesTab.style.display = isSuperAdmin ? 'block' : 'none';
    }
    
    renderAdminPractices();
    loadCoaches();
    loadActivity();
}

function renderAdminPractices() {
    const container = document.getElementById('practices-content');
    if (!container) return;
    
    // Find and preserve the CSV upload section
    const csvSection = container.querySelector('.bg-white.rounded-xl.shadow-md.p-6.mt-8');
    
    // Clear only the practice cards, not the entire container
    const practiceCards = container.querySelectorAll('.bg-white.rounded-xl.shadow-md.p-6:not(.mt-8)');
    practiceCards.forEach(card => card.remove());
    
    // Add practice cards before the CSV section
    practices.forEach(practice => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-md p-6 mb-4';
        
        // Format last updated info
        const lastUpdatedDate = practice.lastUpdatedAt ? formatDate(practice.lastUpdatedAt.toDate()) : formatDate(new Date());
        const lastUpdatedBy = practice.lastUpdatedBy || 'System';
        
        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-lg font-bold text-braves-navy">${practice.title}</h3>
                    <p class="text-sm text-gray-600">Practice ${practice.id} • ${practice.totalTime} minutes</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="openAIAssistant('${practice.docId}')" 
                            class="bg-braves-navy-100 text-braves-navy px-3 py-2 rounded-lg text-sm hover:bg-braves-navy hover:text-white transition-all">
                        <i class="fas fa-robot mr-1"></i>AI Assistant
                    </button>
                    <button onclick="editPractice('${practice.docId}')" 
                            class="bg-braves-navy text-white px-3 py-2 rounded-lg text-sm hover:bg-braves-red transition-all">
                        <i class="fas fa-edit mr-1"></i>Edit
                    </button>
                </div>
            </div>
            <div class="text-sm text-gray-600">
                <p><strong>Stations:</strong> ${practice.stations ? practice.stations.length : 0}</p>
                <p><strong>Last Updated:</strong> ${lastUpdatedDate}</p>
                <p><strong>Last Updated By:</strong> ${lastUpdatedBy}</p>
            </div>
        `;
        
        // Insert before CSV section if it exists, otherwise append to container
        if (csvSection) {
            container.insertBefore(card, csvSection);
        } else {
            container.appendChild(card);
        }
    });
}

async function editPractice(practiceId) {
    const practice = practices.find(p => p.docId === practiceId);
    if (!practice) return;
    
    currentEditingPractice = practice;
    
    const modal = document.getElementById('practice-editor-modal');
    const title = document.getElementById('editor-title');
    const content = document.getElementById('practice-editor-content');
    
    title.textContent = `Edit Practice ${practice.id}: ${practice.title}`;
    
    content.innerHTML = `
        <form id="practice-form">
            <!-- Basic Info -->
            <div class="practice-editor-section">
                <h3><i class="fas fa-info-circle"></i> Basic Information</h3>
                <div class="practice-editor-field">
                    <label for="practice-title">Practice Title</label>
                    <input type="text" id="practice-title" value="${practice.title}" required>
                </div>
                <div class="practice-editor-field">
                    <label for="total-time">Total Time (minutes)</label>
                    <input type="number" id="total-time" value="${practice.totalTime}" class="duration-input" readonly>
                    <div class="total-time-display mt-2">
                        Auto-calculated from sections below
                    </div>
                </div>
            </div>

            <!-- Warmup -->
            <div class="practice-editor-section">
                <h3><i class="fas fa-running"></i> Warmup</h3>
                <div class="practice-editor-field">
                    <label for="warmup-title">Warmup Title</label>
                    <input type="text" id="warmup-title" value="${practice.warmup?.title || ''}" required>
                </div>
                <div class="practice-editor-field">
                    <label for="warmup-desc">Description</label>
                    <textarea id="warmup-desc" required>${practice.warmup?.desc || ''}</textarea>
                </div>
                <div class="practice-editor-field">
                    <label for="warmup-duration">Duration (minutes)</label>
                    <input type="number" id="warmup-duration" value="${practice.warmup?.duration || 5}" class="duration-input" min="1" max="30">
                </div>
            </div>

            <!-- Stations -->
            <div class="practice-editor-section">
                <h3><i class="fas fa-baseball-ball"></i> Skill Stations</h3>
                <div class="practice-editor-field">
                    <label for="station-time">Station Time (minutes)</label>
                    <input type="number" id="station-time" value="${practice.stationTime || 30}" class="duration-input" min="10" max="60">
                </div>
                <div class="practice-editor-field">
                    <label for="station-instructions">Station Instructions</label>
                    <textarea id="station-instructions" required>${practice.stationInstructions || ''}</textarea>
                </div>
                
                <div id="stations-container">
                    ${practice.stations?.map((station, index) => `
                        <div class="station-editor">
                            <h4>Station ${index + 1}</h4>
                            <div class="practice-editor-field">
                                <label for="station-${index}-name">Station Name</label>
                                <input type="text" id="station-${index}-name" value="${station.name}" required>
                            </div>
                            <div class="practice-editor-field">
                                <label for="station-${index}-desc">Description</label>
                                <textarea id="station-${index}-desc" required>${station.desc}</textarea>
                            </div>
                            <div class="practice-editor-field">
                                <label for="station-${index}-video">Video URL</label>
                                <div class="video-input-group">
                                    <input type="url" id="station-${index}-video" value="${station.video || ''}" placeholder="https://www.youtube.com/watch?v=...">
                                    <button type="button" class="find-video-btn" onclick="searchVideos('station-${index}-video', '${station.name}')">
                                        <i class="fas fa-search mr-1"></i>Find Videos
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('') || ''}
                </div>
            </div>

            <!-- Finisher -->
            <div class="practice-editor-section">
                <h3><i class="fas fa-trophy"></i> Fun Finisher</h3>
                <div class="practice-editor-field">
                    <label for="finisher-title">Finisher Title</label>
                    <input type="text" id="finisher-title" value="${practice.finisher?.title || ''}" required>
                </div>
                <div class="practice-editor-field">
                    <label for="finisher-desc">Description</label>
                    <textarea id="finisher-desc" required>${practice.finisher?.desc || ''}</textarea>
                </div>
                <div class="practice-editor-field">
                    <label for="finisher-duration">Duration (minutes)</label>
                    <input type="number" id="finisher-duration" value="${practice.finisher?.duration || 10}" class="duration-input" min="1" max="30">
                </div>
            </div>

            <!-- Wrapup -->
            <div class="practice-editor-section">
                <h3><i class="fas fa-users"></i> Wrapup</h3>
                <div class="practice-editor-field">
                    <label for="wrapup-title">Wrapup Title</label>
                    <input type="text" id="wrapup-title" value="${practice.wrapup?.title || ''}" required>
                </div>
                <div class="practice-editor-field">
                    <label for="wrapup-desc">Description</label>
                    <textarea id="wrapup-desc" required>${practice.wrapup?.desc || ''}</textarea>
                </div>
                <div class="practice-editor-field">
                    <label for="wrapup-duration">Duration (minutes)</label>
                    <input type="number" id="wrapup-duration" value="${practice.wrapup?.duration || 5}" class="duration-input" min="1" max="15">
                </div>
            </div>

            <!-- Homework -->
            <div class="practice-editor-section">
                <h3><i class="fas fa-home"></i> Parent Homework</h3>
                <div class="practice-editor-field">
                    <label for="homework-title">Homework Title</label>
                    <input type="text" id="homework-title" value="${practice.homework?.title || ''}" required>
                </div>
                <div class="practice-editor-field">
                    <label for="homework-desc">Description</label>
                    <textarea id="homework-desc" required>${practice.homework?.desc || ''}</textarea>
                </div>
                <div class="practice-editor-field">
                    <label for="homework-video">Video URL</label>
                    <div class="video-input-group">
                        <input type="url" id="homework-video" value="${practice.homework?.video || ''}" placeholder="https://www.youtube.com/watch?v=...">
                        <button type="button" class="find-video-btn" onclick="searchVideos('homework-video', '${practice.homework?.title || 'homework drill'}')">
                            <i class="fas fa-search mr-1"></i>Find Videos
                        </button>
                    </div>
                </div>
            </div>
        </form>
    `;
    
    // Add event listeners for auto-calculation
    setupDurationCalculation();
    
    modal.classList.remove('hidden');
}

function setupDurationCalculation() {
    const durationInputs = document.querySelectorAll('.duration-input:not(#total-time)');
    const totalTimeInput = document.getElementById('total-time');
    
    function calculateTotal() {
        let total = 0;
        durationInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            total += value;
        });
        
        // Add station time
        const stationTime = parseInt(document.getElementById('station-time')?.value) || 0;
        total += stationTime;
        
        totalTimeInput.value = total;
    }
    
    durationInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
    
    document.getElementById('station-time')?.addEventListener('input', calculateTotal);
    
    // Calculate initial total
    calculateTotal();
}

async function savePractice() {
    if (!currentEditingPractice) return;
    
    try {
        const form = document.getElementById('practice-form');
        const formData = new FormData(form);
        
        // Collect form data
        const updatedPractice = {
            ...currentEditingPractice,
            title: document.getElementById('practice-title').value,
            totalTime: parseInt(document.getElementById('total-time').value),
            warmup: {
                title: document.getElementById('warmup-title').value,
                desc: document.getElementById('warmup-desc').value,
                duration: parseInt(document.getElementById('warmup-duration').value)
            },
            stationTime: parseInt(document.getElementById('station-time').value),
            stationInstructions: document.getElementById('station-instructions').value,
            stations: [],
            finisher: {
                title: document.getElementById('finisher-title').value,
                desc: document.getElementById('finisher-desc').value,
                duration: parseInt(document.getElementById('finisher-duration').value)
            },
            wrapup: {
                title: document.getElementById('wrapup-title').value,
                desc: document.getElementById('wrapup-desc').value,
                duration: parseInt(document.getElementById('wrapup-duration').value)
            },
            homework: {
                title: document.getElementById('homework-title').value,
                desc: document.getElementById('homework-desc').value,
                video: document.getElementById('homework-video').value
            },
            // Add tracking fields
            lastUpdatedAt: new Date(),
            lastUpdatedBy: currentUser?.displayName || currentUser?.email || 'Unknown User'
        };
        
        // Collect stations data
        for (let i = 0; i < 4; i++) {
            const nameEl = document.getElementById(`station-${i}-name`);
            const descEl = document.getElementById(`station-${i}-desc`);
            const videoEl = document.getElementById(`station-${i}-video`);
            
            if (nameEl && descEl) {
                updatedPractice.stations.push({
                    name: nameEl.value,
                    desc: descEl.value,
                    video: videoEl?.value || ''
                });
            }
        }
        
        // Update in Firestore
        await updateDoc(doc(db, "practices", currentEditingPractice.docId), updatedPractice);
        
        // Log the change
        await logPracticeChange(currentEditingPractice.id, currentEditingPractice.title, 'edited');
        
        // Close modal
        document.getElementById('practice-editor-modal').classList.add('hidden');
        currentEditingPractice = null;
        
        console.log('Practice updated successfully');
        
    } catch (error) {
        console.error('Error saving practice:', error);
        alert('Error saving practice. Please try again.');
    }
}

// --- COACH MANAGEMENT ---
async function loadCoaches() {
    if (!isSuperAdmin) return;
    
    try {
        const coachesRef = collection(db, "authorized_coaches");
        const snapshot = await getDocs(coachesRef);
        
        authorizedCoaches = [];
        snapshot.forEach((doc) => {
            authorizedCoaches.push({ id: doc.id, ...doc.data() });
        });
        
        renderCoaches();
    } catch (error) {
        console.error("Error loading coaches:", error);
    }
}

function renderCoaches() {
    const container = document.getElementById('coaches-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    authorizedCoaches.forEach(coach => {
        const card = document.createElement('div');
        card.className = 'enhanced-coach-card';
        
        // Generate avatar HTML
        const avatarHtml = coach.photoURL ? 
            `<img src="${coach.photoURL}" alt="${coach.displayName || coach.email}" class="coach-avatar">` :
            `<div class="coach-avatar-fallback">${getInitials(coach.displayName || coach.email)}</div>`;
        
        // Determine display name
        const displayName = coach.displayName || coach.email.split('@')[0];
        
        card.innerHTML = `
            <div class="coach-profile-section">
                ${avatarHtml}
                <div class="coach-details">
                    <div class="coach-name-section">
                        <h4 class="coach-display-name" id="display-name-${coach.id}">${displayName}</h4>
                        <button onclick="editCoachName('${coach.id}')" class="edit-name-btn" title="Edit name">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                    </div>
                    <p class="coach-email">Email: ${coach.email}</p>
                    <div class="coach-metadata">
                        <p class="text-xs text-gray-500">Added: ${formatDate(coach.addedAt?.toDate?.() || new Date())}</p>
                        ${coach.lastLogin ? `<p class="text-xs text-gray-500">Last login: ${formatDate(coach.lastLogin.toDate())}</p>` : ''}
                    </div>
                </div>
            </div>
            <div class="coach-actions">
                <span class="coach-status ${coach.isActive ? 'active' : 'inactive'}">
                    ${coach.isActive ? 'Active' : 'Inactive'}
                </span>
                <button onclick="toggleCoach('${coach.id}')" 
                        class="action-btn ${coach.isActive ? 'deactivate-btn' : 'activate-btn'}">
                    ${coach.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onclick="removeCoach('${coach.id}')" class="action-btn remove-btn">
                    Remove
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function addCoach() {
    const emailInput = document.getElementById('new-coach-email');
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Please enter an email address');
        return;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    try {
        await addDoc(collection(db, "authorized_coaches"), {
            email: email,
            displayName: email.split('@')[0], // Default to email username
            photoURL: null, // Will be populated when they first sign in
            addedBy: currentUser.email,
            addedAt: new Date(),
            isActive: true
        });
        
        emailInput.value = '';
        loadCoaches();
        
    } catch (error) {
        console.error('Error adding coach:', error);
        alert('Error adding coach. Please try again.');
    }
}

async function toggleCoach(coachId) {
    try {
        const coach = authorizedCoaches.find(c => c.id === coachId);
        if (!coach) return;
        
        await updateDoc(doc(db, "authorized_coaches", coachId), {
            isActive: !coach.isActive
        });
        
        loadCoaches();
        
    } catch (error) {
        console.error('Error toggling coach:', error);
        alert('Error updating coach status. Please try again.');
    }
}

async function removeCoach(coachId) {
    const coach = authorizedCoaches.find(c => c.id === coachId);
    if (!coach) return;
    
    showConfirmation(
        'Remove Coach',
        `Are you sure you want to remove ${coach.email}? This action cannot be undone.`,
        async () => {
            try {
                await deleteDoc(doc(db, "authorized_coaches", coachId));
                loadCoaches();
            } catch (error) {
                console.error('Error removing coach:', error);
                alert('Error removing coach. Please try again.');
            }
        }
    );
}

// --- ACTIVITY TRACKING ---
async function logPracticeChange(practiceId, practiceTitle, changeType) {
    if (!currentUser?.email) return;
    
    try {
        await addDoc(collection(db, "practice_changes"), {
            practiceId: practiceId,
            practiceTitle: practiceTitle,
            changedBy: currentUser.email,
            changedByName: currentUser.displayName || currentUser.email.split('@')[0],
            changeType: changeType,
            changedAt: new Date()
        });
    } catch (error) {
        console.error('Error logging practice change:', error);
    }
}

async function loadActivity() {
    try {
        const changesRef = collection(db, "practice_changes");
        const q = query(changesRef, orderBy("changedAt", "desc"), limit(20));
        const snapshot = await getDocs(q);
        
        practiceChanges = [];
        snapshot.forEach((doc) => {
            practiceChanges.push({ id: doc.id, ...doc.data() });
        });
        
        renderActivity();
    } catch (error) {
        console.error("Error loading activity:", error);
    }
}

function renderActivity() {
    const container = document.getElementById('activity-list');
    if (!container) return;
    
    if (practiceChanges.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No recent activity</p>';
        return;
    }
    
    container.innerHTML = '';
    
    practiceChanges.forEach(change => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon ${change.changeType}">
                <i class="fas fa-${change.changeType === 'edited' ? 'edit' : 'plus'}"></i>
            </div>
            <div class="activity-content">
                <h4>${change.changedByName} ${change.changeType} "${change.practiceTitle}"</h4>
                <p>Practice ${change.practiceId} was ${change.changeType}</p>
                <span class="activity-time">${getTimeAgo(change.changedAt?.toDate?.() || new Date())}</span>
            </div>
        `;
        container.appendChild(item);
    });
}


// --- VIDEO SEARCH FUNCTIONALITY ---
// Use unified video search module for all video search operations
async function searchVideos(inputId, searchTerm) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    currentVideoSearchTarget = inputId;
    
    const dropdown = document.getElementById('video-search-dropdown');
    const searchTermEl = document.getElementById('search-term');
    const loadingEl = document.getElementById('video-search-loading');
    const resultsEl = document.getElementById('video-search-results');
    const errorEl = document.getElementById('video-search-error');
    const noResultsEl = document.getElementById('video-search-no-results');
    
    // Position dropdown near input
    const rect = input.getBoundingClientRect();
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.top = `${rect.bottom + 5}px`;
    
    // Show dropdown with loading state
    searchTermEl.textContent = searchTerm;
    loadingEl.classList.remove('hidden');
    resultsEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    noResultsEl.classList.add('hidden');
    dropdown.classList.remove('hidden');
    
    try {
        // Use unified video search manager
        const videos = await videoSearchManager.searchVideos(searchTerm);
        showVideoResults(videos, searchTerm);
    } catch (error) {
        console.error('Video search error:', error);
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
    }
}

function showVideoResults(videos, searchTerm) {
    const loadingEl = document.getElementById('video-search-loading');
    const resultsEl = document.getElementById('video-search-results');
    const noResultsEl = document.getElementById('video-search-no-results');
    
    loadingEl.classList.add('hidden');
    
    if (videos.length === 0) {
        noResultsEl.classList.remove('hidden');
        return;
    }
    
    resultsEl.innerHTML = '';
    
    videos.forEach(video => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'video-result flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer';
        resultDiv.innerHTML = `
            <img src="${video.snippet.thumbnails.default.url}" 
                 alt="${video.snippet.title}" 
                 class="video-result-thumbnail">
            <div class="video-result-info">
                <div class="video-result-title">${video.snippet.title}</div>
                <div class="video-result-channel">${video.snippet.channelTitle}</div>
                <div class="video-result-actions">
                    <button class="video-result-btn use-btn" onclick="useVideo('${video.id.videoId}')">
                        Use This Video
                    </button>
                    <button class="video-result-btn preview-btn" onclick="previewVideo('${video.id.videoId}', '${video.snippet.title.replace(/'/g, "\\'")}')">
                        Preview
                    </button>
                </div>
            </div>
        `;
        resultsEl.appendChild(resultDiv);
    });
    
    resultsEl.classList.remove('hidden');
}

function useVideo(videoId) {
    if (!currentVideoSearchTarget) return;
    
    const input = document.getElementById(currentVideoSearchTarget);
    if (input) {
        input.value = `https://www.youtube.com/watch?v=${videoId}`;
    }
    
    closeVideoSearch();
}

function previewVideo(videoId, title) {
    openVideo(`https://www.youtube.com/watch?v=${videoId}`, title);
}

function closeVideoSearch() {
    const dropdown = document.getElementById('video-search-dropdown');
    dropdown.classList.add('hidden');
    currentVideoSearchTarget = null;
}

// --- CSV UPLOAD FUNCTIONALITY ---
function generateSampleCSV() {
    const headers = [
        'id', 'title', 'totalTime',
        'warmup_title', 'warmup_desc', 'warmup_duration',
        'stationTime', 'stationInstructions',
        'station1_name', 'station1_desc', 'station1_video',
        'station2_name', 'station2_desc', 'station2_video',
        'station3_name', 'station3_desc', 'station3_video',
        'station4_name', 'station4_desc', 'station4_video',
        'finisher_title', 'finisher_desc', 'finisher_duration',
        'wrapup_title', 'wrapup_desc', 'wrapup_duration',
        'homework_title', 'homework_desc', 'homework_video'
    ];
    
    const rows = [headers];
    
    // Add current practice data
    practices.forEach(practice => {
        const row = [
            practice.id,
            practice.title,
            practice.totalTime,
            practice.warmup?.title || '',
            practice.warmup?.desc || '',
            practice.warmup?.duration || 5,
            practice.stationTime || 35,
            practice.stationInstructions || '',
            practice.stations?.[0]?.name || '',
            practice.stations?.[0]?.desc || '',
            practice.stations?.[0]?.video || '',
            practice.stations?.[1]?.name || '',
            practice.stations?.[1]?.desc || '',
            practice.stations?.[1]?.video || '',
            practice.stations?.[2]?.name || '',
            practice.stations?.[2]?.desc || '',
            practice.stations?.[2]?.video || '',
            practice.stations?.[3]?.name || '',
            practice.stations?.[3]?.desc || '',
            practice.stations?.[3]?.video || '',
            practice.finisher?.title || '',
            practice.finisher?.desc || '',
            practice.finisher?.duration || 15,
            practice.wrapup?.title || '',
            practice.wrapup?.desc || '',
            practice.wrapup?.duration || 5,
            practice.homework?.title || '',
            practice.homework?.desc || '',
            practice.homework?.video || ''
        ];
        rows.push(row);
    });
    
    return rows.map(row => 
        row.map(cell => {
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            const cellStr = String(cell || '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return '"' + cellStr.replace(/"/g, '""') + '"';
            }
            return cellStr;
        }).join(',')
    ).join('\n');
}

function downloadSampleCSV() {
    try {
        const csvContent = generateSampleCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'baseball_practices_sample.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (error) {
        console.error('Error generating CSV:', error);
        alert('Error generating sample CSV. Please try again.');
    }
}

function parseCSV(csvText) {
    const lines = [];
    let currentLine = '';
    let inQuotes = false;
    
    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentLine += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === '\n' && !inQuotes) {
            if (currentLine.trim()) {
                lines.push(currentLine);
            }
            currentLine = '';
        } else {
            currentLine += char;
        }
    }
    
    if (currentLine.trim()) {
        lines.push(currentLine);
    }
    
    return lines.map(line => {
        const fields = [];
        let currentField = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentField += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                fields.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        
        fields.push(currentField);
        return fields;
    });
}

function validateCSVData(data) {
    const errors = [];
    const warnings = [];
    
    if (data.length < 2) {
        errors.push('CSV must contain at least a header row and one data row');
        return { errors, warnings, validPractices: [] };
    }
    
    const headers = data[0];
    const expectedHeaders = [
        'id', 'title', 'totalTime',
        'warmup_title', 'warmup_desc', 'warmup_duration',
        'stationTime', 'stationInstructions',
        'station1_name', 'station1_desc', 'station1_video',
        'station2_name', 'station2_desc', 'station2_video',
        'station3_name', 'station3_desc', 'station3_video',
        'station4_name', 'station4_desc', 'station4_video',
        'finisher_title', 'finisher_desc', 'finisher_duration',
        'wrapup_title', 'wrapup_desc', 'wrapup_duration',
        'homework_title', 'homework_desc', 'homework_video'
    ];
    
    // Check for missing required headers
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
        errors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
    }
    
    const validPractices = [];
    
    // Validate each practice row
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const practice = {};
        
        // Map CSV columns to practice object
        headers.forEach((header, index) => {
            const value = row[index] || '';
            
            switch (header) {
                case 'id':
                    practice.id = parseInt(value);
                    if (isNaN(practice.id) || practice.id < 1 || practice.id > 8) {
                        errors.push(`Row ${i + 1}: Invalid practice ID "${value}". Must be 1-8.`);
                    }
                    break;
                case 'title':
                    practice.title = value.trim();
                    if (!practice.title) {
                        errors.push(`Row ${i + 1}: Practice title is required.`);
                    }
                    break;
                case 'totalTime':
                    practice.totalTime = parseInt(value);
                    if (isNaN(practice.totalTime) || practice.totalTime < 30 || practice.totalTime > 120) {
                        warnings.push(`Row ${i + 1}: Total time "${value}" seems unusual. Expected 30-120 minutes.`);
                    }
                    break;
                case 'warmup_title':
                    practice.warmup = practice.warmup || {};
                    practice.warmup.title = value.trim();
                    break;
                case 'warmup_desc':
                    practice.warmup = practice.warmup || {};
                    practice.warmup.desc = value.trim();
                    break;
                case 'warmup_duration':
                    practice.warmup = practice.warmup || {};
                    practice.warmup.duration = parseInt(value) || 5;
                    break;
                case 'stationTime':
                    practice.stationTime = parseInt(value) || 35;
                    break;
                case 'stationInstructions':
                    practice.stationInstructions = value.trim();
                    break;
                case 'finisher_title':
                    practice.finisher = practice.finisher || {};
                    practice.finisher.title = value.trim();
                    break;
                case 'finisher_desc':
                    practice.finisher = practice.finisher || {};
                    practice.finisher.desc = value.trim();
                    break;
                case 'finisher_duration':
                    practice.finisher = practice.finisher || {};
                    practice.finisher.duration = parseInt(value) || 15;
                    break;
                case 'wrapup_title':
                    practice.wrapup = practice.wrapup || {};
                    practice.wrapup.title = value.trim();
                    break;
                case 'wrapup_desc':
                    practice.wrapup = practice.wrapup || {};
                    practice.wrapup.desc = value.trim();
                    break;
                case 'wrapup_duration':
                    practice.wrapup = practice.wrapup || {};
                    practice.wrapup.duration = parseInt(value) || 5;
                    break;
                case 'homework_title':
                    practice.homework = practice.homework || {};
                    practice.homework.title = value.trim();
                    break;
                case 'homework_desc':
                    practice.homework = practice.homework || {};
                    practice.homework.desc = value.trim();
                    break;
                case 'homework_video':
                    practice.homework = practice.homework || {};
                    practice.homework.video = value.trim();
                    break;
                default:
                    // Handle station fields
                    if (header.startsWith('station')) {
                        const match = header.match(/station(\d+)_(.+)/);
                        if (match) {
                            const stationIndex = parseInt(match[1]) - 1;
                            const field = match[2];
                            
                            practice.stations = practice.stations || [{}, {}, {}, {}];
                            practice.stations[stationIndex] = practice.stations[stationIndex] || {};
                            practice.stations[stationIndex][field] = value.trim();
                        }
                    }
                    break;
            }
        });
        
        // Ensure stations array is complete
        if (practice.stations) {
            for (let j = 0; j < 4; j++) {
                if (!practice.stations[j]) {
                    practice.stations[j] = { name: '', desc: '', video: '' };
                }
            }
        }
        
        validPractices.push(practice);
    }
    
    return { errors, warnings, validPractices };
}

async function processCSVUpload(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const csvText = e.target.result;
                const data = parseCSV(csvText);
                const validation = validateCSVData(data);
                resolve(validation);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

function showUploadResults(validation) {
    const resultsDiv = document.getElementById('upload-results');
    const summaryDiv = document.getElementById('upload-summary');
    const errorsDiv = document.getElementById('upload-errors');
    
    resultsDiv.classList.remove('hidden');
    
    const { errors, warnings, validPractices } = validation;
    
    if (errors.length > 0) {
        summaryDiv.className = 'p-3 rounded-lg bg-red-100 border border-red-300';
        summaryDiv.innerHTML = `
            <div class="flex items-center mb-2">
                <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                <span class="font-semibold text-red-800">Validation Failed</span>
            </div>
            <p class="text-red-700 text-sm">Please fix the following errors before uploading:</p>
        `;
        
        errorsDiv.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                <ul class="text-sm text-red-700 space-y-1">
                    ${errors.map(error => `<li>• ${error}</li>`).join('')}
                </ul>
            </div>
        `;
        errorsDiv.classList.remove('hidden');
        
        document.getElementById('confirm-upload').disabled = true;
    } else {
        summaryDiv.className = 'p-3 rounded-lg bg-green-100 border border-green-300';
        summaryDiv.innerHTML = `
            <div class="flex items-center mb-2">
                <i class="fas fa-check-circle text-green-600 mr-2"></i>
                <span class="font-semibold text-green-800">Ready to Upload</span>
            </div>
            <p class="text-green-700 text-sm">Found ${validPractices.length} valid practices to update.</p>
            ${warnings.length > 0 ? `
                <div class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p class="text-yellow-800 text-xs font-semibold mb-1">Warnings:</p>
                    <ul class="text-xs text-yellow-700 space-y-1">
                        ${warnings.map(warning => `<li>• ${warning}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
        
        errorsDiv.classList.add('hidden');
        document.getElementById('confirm-upload').disabled = false;
        
        // Store validated data for upload
        csvUploadData = validPractices;
    }
}

async function confirmCSVUpload() {
    if (!csvUploadData) return;
    
    const confirmBtn = document.getElementById('confirm-upload');
    const originalText = confirmBtn.innerHTML;
    
    try {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Uploading...';
        
        let updateCount = 0;
        
        for (const practiceData of csvUploadData) {
            // Find existing practice
            const existingPractice = practices.find(p => p.id === practiceData.id);
            if (!existingPractice) continue;
            
            // Merge with existing data and add tracking
            const updatedPractice = {
                ...existingPractice,
                ...practiceData,
                lastUpdatedAt: new Date(),
                lastUpdatedBy: currentUser?.displayName || currentUser?.email || 'CSV Upload'
            };
            
            // Update in Firestore
            await updateDoc(doc(db, "practices", existingPractice.docId), updatedPractice);
            
            // Log the change
            await logPracticeChange(practiceData.id, practiceData.title, 'bulk_updated');
            
            updateCount++;
        }
        
        // Show success message
        const summaryDiv = document.getElementById('upload-summary');
        summaryDiv.className = 'p-3 rounded-lg bg-blue-100 border border-blue-300';
        summaryDiv.innerHTML = `
            <div class="flex items-center mb-2">
                <i class="fas fa-check-circle text-blue-600 mr-2"></i>
                <span class="font-semibold text-blue-800">Upload Complete!</span>
            </div>
            <p class="text-blue-700 text-sm">Successfully updated ${updateCount} practices.</p>
        `;
        
        // Reset upload state
        setTimeout(() => {
            resetCSVUpload();
        }, 3000);
        
    } catch (error) {
        console.error('Error uploading CSV data:', error);
        alert('Error uploading practices. Please try again.');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalText;
    }
}

function resetCSVUpload() {
    csvUploadData = null;
    document.getElementById('upload-results').classList.add('hidden');
    document.getElementById('upload-prompt').classList.remove('hidden');
    document.getElementById('upload-progress').classList.add('hidden');
    document.getElementById('csv-file-input').value = '';
}

// --- UTILITY FUNCTIONS ---
function printPractice() {
    window.print();
}

// --- TAB MANAGEMENT ---
function switchTab(tabName) {
    // Hide all content areas
    document.getElementById('practices-content').classList.add('hidden');
    document.getElementById('coaches-content').classList.add('hidden');
    document.getElementById('activity-content').classList.add('hidden');
    
    // Remove active class from all tabs
    const allTabs = ['practices-tab', 'coaches-tab', 'activity-tab'];
    allTabs.forEach(tabId => {
        const tab = document.getElementById(tabId);
        if (tab) {
            tab.classList.remove('border-b-2', 'border-braves-red', 'text-braves-navy');
            tab.classList.add('text-gray-500', 'hover:text-braves-navy');
        }
    });
    
    // Show selected content and activate tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    const selectedContent = document.getElementById(`${tabName}-content`);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('border-b-2', 'border-braves-red', 'text-braves-navy');
        selectedTab.classList.remove('text-gray-500');
        selectedContent.classList.remove('hidden');
        
        // Load data for specific tabs
        if (tabName === 'coaches') {
            loadCoaches();
        } else if (tabName === 'activity') {
            loadActivity();
        }
    }
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing app...");
    initializeAuth();
    loadPractices();
    
    // Admin modal event listeners
    const adminToggle = document.getElementById('admin-toggle');
    const adminModal = document.getElementById('admin-modal');
    const closeAdminModal = document.getElementById('close-admin-modal');
    const showEmailLogin = document.getElementById('show-email-login');
    const adminLoginForm = document.getElementById('admin-login-form');
    const googleSigninBtn = document.getElementById('google-signin-btn');
    
    adminToggle?.addEventListener('click', () => {
        adminModal.classList.remove('hidden');
    });
    
    closeAdminModal?.addEventListener('click', () => {
        adminModal.classList.add('hidden');
    });
    
    showEmailLogin?.addEventListener('click', () => {
        document.getElementById('admin-login-form').classList.remove('hidden');
        document.getElementById('show-email-login').style.display = 'none';
    });
    
    googleSigninBtn?.addEventListener('click', async () => {
        try {
            console.log('Starting Google sign-in...');
            
            // Clear any previous errors
            const errorDiv = document.getElementById('admin-error');
            errorDiv.classList.add('hidden');
            
            // Show loading state
            googleSigninBtn.disabled = true;
            googleSigninBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-3"></i>Signing in...';
            
            // Try popup first
            const result = await signInWithPopup(auth, provider);
            console.log('Google sign-in successful:', result.user);
            
            // Don't close modal here - let handleAuthSuccess do it
            
        } catch (error) {
            console.error('Google sign-in error:', error);
            
            // Reset button state
            googleSigninBtn.disabled = false;
            googleSigninBtn.innerHTML = `
                <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
            `;
            
            // Show error message
            const errorDiv = document.getElementById('admin-error');
            if (error.code === 'auth/popup-closed-by-user') {
                errorDiv.textContent = 'Sign-in was cancelled. Please try again.';
            } else if (error.code === 'auth/popup-blocked') {
                errorDiv.textContent = 'Popup was blocked. Please allow popups and try again.';
            } else {
                errorDiv.textContent = 'Sign-in failed. Please try again.';
            }
            errorDiv.classList.remove('hidden');
        }
    });
    
    adminLoginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            adminModal.classList.add('hidden');
        } catch (error) {
            console.error('Login error:', error);
            const errorDiv = document.getElementById('admin-error');
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });
    
    // Video modal close
    document.getElementById('close-video-modal')?.addEventListener('click', closeVideo);
    
    // Practice editor modal event listeners
    document.getElementById('save-practice')?.addEventListener('click', savePractice);
    document.getElementById('cancel-edit')?.addEventListener('click', () => {
        document.getElementById('practice-editor-modal').classList.add('hidden');
        currentEditingPractice = null;
    });
    document.getElementById('close-editor')?.addEventListener('click', () => {
        document.getElementById('practice-editor-modal').classList.add('hidden');
        currentEditingPractice = null;
    });
    
    // Admin tab navigation
    document.getElementById('practices-tab')?.addEventListener('click', () => switchTab('practices'));
    document.getElementById('coaches-tab')?.addEventListener('click', () => switchTab('coaches'));
    document.getElementById('activity-tab')?.addEventListener('click', () => switchTab('activity'));
    
    // Admin logout
    document.getElementById('admin-logout')?.addEventListener('click', async () => {
        try {
            await signOut(auth);
            document.getElementById('admin-dashboard').classList.add('hidden');
            isAdmin = false;
            isSuperAdmin = false;
            currentUser = null;
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
    
    // Coach management
    document.getElementById('add-coach-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addCoach();
    });
    
    // Video search close
    document.getElementById('close-video-search')?.addEventListener('click', closeVideoSearch);
    document.getElementById('retry-search')?.addEventListener('click', () => {
        if (currentVideoSearchTarget) {
            const input = document.getElementById(currentVideoSearchTarget);
            const searchTerm = document.getElementById('search-term').textContent;
            searchVideos(currentVideoSearchTarget, searchTerm);
        }
    });
    document.getElementById('manual-entry-btn')?.addEventListener('click', closeVideoSearch);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('video-search-dropdown');
        if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.find-video-btn')) {
            closeVideoSearch();
        }
    });
    
    // CSV Upload event listeners
    document.getElementById('download-sample-csv')?.addEventListener('click', downloadSampleCSV);
    
    const csvUploadArea = document.getElementById('csv-upload-area');
    const csvFileInput = document.getElementById('csv-file-input');
    
    csvUploadArea?.addEventListener('click', () => {
        csvFileInput?.click();
    });
    
    csvUploadArea?.addEventListener('dragover', (e) => {
        e.preventDefault();
        csvUploadArea.classList.add('border-braves-red', 'bg-red-50');
    });
    
    csvUploadArea?.addEventListener('dragleave', (e) => {
        e.preventDefault();
        csvUploadArea.classList.remove('border-braves-red', 'bg-red-50');
    });
    
    csvUploadArea?.addEventListener('drop', (e) => {
        e.preventDefault();
        csvUploadArea.classList.remove('border-braves-red', 'bg-red-50');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'text/csv') {
            handleCSVFile(files[0]);
        } else {
            alert('Please drop a valid CSV file.');
        }
    });
    
    csvFileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleCSVFile(file);
        }
    });
    
    document.getElementById('confirm-upload')?.addEventListener('click', confirmCSVUpload);
    document.getElementById('cancel-upload')?.addEventListener('click', resetCSVUpload);
    
    // AI Assistant event listeners
    document.getElementById('close-ai-modal')?.addEventListener('click', closeAIAssistant);
    document.getElementById('suggest-drills-btn')?.addEventListener('click', handleSuggestDrills);
    document.getElementById('auto-fill-btn')?.addEventListener('click', handleAutoFillDescriptions);
    document.getElementById('summarize-btn')?.addEventListener('click', handleSummarizeForParents);
    document.getElementById('retry-ai')?.addEventListener('click', retryAIAction);
    document.getElementById('clear-results')?.addEventListener('click', clearAIResults);
    
    // AI input character counter
    const aiInput = document.getElementById('ai-input');
    const charCount = document.getElementById('char-count');
    
    aiInput?.addEventListener('input', () => {
        const count = aiInput.value.length;
        charCount.textContent = count;
        
        // Change color as approaching limit
        if (count > 400) {
            charCount.classList.add('text-red-500');
            charCount.classList.remove('text-gray-400');
        } else if (count > 300) {
            charCount.classList.add('text-yellow-500');
            charCount.classList.remove('text-gray-400', 'text-red-500');
        } else {
            charCount.classList.add('text-gray-400');
            charCount.classList.remove('text-yellow-500', 'text-red-500');
        }
    });
    
    // Close AI modal when clicking outside
    document.getElementById('ai-assistant-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'ai-assistant-modal') {
            closeAIAssistant();
        }
    });
});

async function handleCSVFile(file) {
    const uploadPrompt = document.getElementById('upload-prompt');
    const uploadProgress = document.getElementById('upload-progress');
    
    uploadPrompt.classList.add('hidden');
    uploadProgress.classList.remove('hidden');
    
    try {
        const validation = await processCSVUpload(file);
        showUploadResults(validation);
    } catch (error) {
        console.error('Error processing CSV:', error);
        alert('Error processing CSV file. Please check the format and try again.');
        resetCSVUpload();
    } finally {
        uploadProgress.classList.add('hidden');
    }
}

// --- PROFILE MANAGEMENT FUNCTIONS ---
function getInitials(name) {
    if (!name) return '?';
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

function editCoachName(coachId) {
    const coach = authorizedCoaches.find(c => c.id === coachId);
    if (!coach) return;
    
    const displayNameEl = document.getElementById(`display-name-${coachId}`);
    const currentName = coach.displayName || coach.email.split('@')[0];
    
    // Create inline editor
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'coach-name-input';
    input.maxLength = 50;
    
    // Create save/cancel buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'name-edit-buttons';
    
    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = '<i class="fas fa-check"></i>';
    saveBtn.className = 'save-name-btn';
    saveBtn.onclick = () => saveCoachName(coachId, input.value.trim());
    
    const cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
    cancelBtn.className = 'cancel-name-btn';
    cancelBtn.onclick = () => cancelNameEdit(coachId);
    
    buttonsDiv.appendChild(saveBtn);
    buttonsDiv.appendChild(cancelBtn);
    
    // Replace display name with editor
    displayNameEl.innerHTML = '';
    displayNameEl.appendChild(input);
    displayNameEl.appendChild(buttonsDiv);
    
    // Focus and select text
    input.focus();
    input.select();
    
    // Handle Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveCoachName(coachId, input.value.trim());
        } else if (e.key === 'Escape') {
            cancelNameEdit(coachId);
        }
    });
}

async function saveCoachName(coachId, newName) {
    if (!newName) {
        alert('Name cannot be empty');
        return;
    }
    
    try {
        await updateDoc(doc(db, "authorized_coaches", coachId), {
            displayName: newName
        });
        
        // Update local data and re-render
        const coach = authorizedCoaches.find(c => c.id === coachId);
        if (coach) {
            coach.displayName = newName;
        }
        
        renderCoaches();
        
    } catch (error) {
        console.error('Error updating coach name:', error);
        alert('Error updating name. Please try again.');
        cancelNameEdit(coachId);
    }
}

function cancelNameEdit(coachId) {
    renderCoaches();
}

// --- AI ASSISTANT FUNCTIONALITY ---
let currentAIPractice = null;
let lastAIAction = null;

function openAIAssistant(practiceId) {
    const practice = practices.find(p => p.docId === practiceId);
    if (!practice) return;
    
    currentAIPractice = practice;
    
    const modal = document.getElementById('ai-assistant-modal');
    const input = document.getElementById('ai-input');
    const charCount = document.getElementById('char-count');
    
    // Reset modal state
    hideAllAIStates();
    input.value = '';
    charCount.textContent = '0';
    
    modal.classList.remove('hidden');
    input.focus();
}

function closeAIAssistant() {
    const modal = document.getElementById('ai-assistant-modal');
    modal.classList.add('hidden');
    currentAIPractice = null;
    lastAIAction = null;
    hideAllAIStates();
}

function hideAllAIStates() {
    document.getElementById('ai-results').classList.add('hidden');
    document.getElementById('ai-loading').classList.add('hidden');
    document.getElementById('ai-error').classList.add('hidden');
}

function showAILoading() {
    hideAllAIStates();
    document.getElementById('ai-loading').classList.remove('hidden');
}

function showAIError(message) {
    hideAllAIStates();
    const errorDiv = document.getElementById('ai-error');
    const messageEl = document.getElementById('ai-error-message');
    messageEl.textContent = message;
    errorDiv.classList.remove('hidden');
}

function showAIResults(content) {
    hideAllAIStates();
    const resultsDiv = document.getElementById('ai-results');
    const contentDiv = document.getElementById('ai-results-content');
    contentDiv.innerHTML = content;
    resultsDiv.classList.remove('hidden');
}

async function handleSuggestDrills() {
    const input = document.getElementById('ai-input');
    const teamStruggles = input.value.trim();
    
    if (!teamStruggles) {
        alert('Please describe what your team is struggling with first.');
        input.focus();
        return;
    }
    
    lastAIAction = 'suggest-drills';
    showAILoading();
    
    try {
        const drills = await aiAssistant.suggestDrillVariations(teamStruggles);
        
        let html = `
            <div class="space-y-4">
                <div class="flex items-center justify-between mb-4">
                    <h5 class="font-semibold text-braves-navy">Suggested Drills for: "${teamStruggles}"</h5>
                    <div class="text-xs text-gray-500">
                        ${drills.length} drill${drills.length !== 1 ? 's' : ''} found
                    </div>
                </div>
        `;
        
        drills.forEach((drill, index) => {
            html += `
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-start justify-between mb-3">
                        <h6 class="font-semibold text-gray-800">${drill.name}</h6>
                        <span class="text-xs bg-braves-red text-white px-2 py-1 rounded">${drill.keyFocus}</span>
                    </div>
                    <p class="text-gray-700 text-sm mb-3">${drill.description}</p>
                    <div class="flex flex-wrap gap-2 mb-3">
                        <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            <i class="fas fa-tools mr-1"></i>${drill.equipment}
                        </span>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="searchVideosFromAI('${drill.youtubeSearch}')" 
                                class="bg-braves-navy text-white px-3 py-1 rounded text-xs hover:bg-braves-red transition-all">
                            <i class="fas fa-search mr-1"></i>Find Videos
                        </button>
                        <button onclick="copyDrillToClipboard('${drill.name}', '${drill.description.replace(/'/g, "\\'")}', '${drill.equipment}')" 
                                class="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-all">
                            <i class="fas fa-copy mr-1"></i>Copy Drill
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `
            </div>
            <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h6 class="font-semibold text-blue-800 mb-2">💡 How to Use These Drills</h6>
                <ul class="text-blue-700 text-sm space-y-1">
                    <li>• Replace any existing station with these new drills</li>
                    <li>• Use "Find Videos" to get instructional content</li>
                    <li>• Copy drill details to add to your practice notes</li>
                    <li>• Modify descriptions to match your team's skill level</li>
                </ul>
            </div>
        `;
        
        showAIResults(html);
        
    } catch (error) {
        console.error('Error getting drill suggestions:', error);
        showAIError(error.message || 'Failed to generate drill suggestions. Please try again.');
    }
}

async function handleAutoFillDescriptions() {
    if (!currentAIPractice) {
        showAIError('No practice selected. Please try again.');
        return;
    }
    
    const input = document.getElementById('ai-input');
    const context = input.value.trim();
    
    lastAIAction = 'auto-fill';
    showAILoading();
    
    try {
        // Get drill names from current practice
        const drillNames = [];
        if (currentAIPractice.stations) {
            currentAIPractice.stations.forEach(station => {
                if (station.name) drillNames.push(station.name);
            });
        }
        
        if (drillNames.length === 0) {
            showAIError('No drill names found in this practice to generate descriptions for.');
            return;
        }
        
        let html = `
            <div class="space-y-4">
                <div class="flex items-center justify-between mb-4">
                    <h5 class="font-semibold text-braves-navy">Generated Descriptions for Practice ${currentAIPractice.id}</h5>
                    <div class="text-xs text-gray-500">
                        ${drillNames.length} drill${drillNames.length !== 1 ? 's' : ''} processed
                    </div>
                </div>
        `;
        
        for (const drillName of drillNames) {
            try {
                const description = await aiAssistant.autoFillDescription(drillName, context);
                
                html += `
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="flex items-start justify-between mb-3">
                            <h6 class="font-semibold text-gray-800">${drillName}</h6>
                            <button onclick="copyDescriptionToClipboard('${description.replace(/'/g, "\\'")}', '${drillName}')" 
                                    class="text-xs bg-braves-red text-white px-2 py-1 rounded hover:bg-braves-red-hover transition-all">
                                <i class="fas fa-copy mr-1"></i>Copy
                            </button>
                        </div>
                        <p class="text-gray-700 text-sm">${description}</p>
                    </div>
                `;
            } catch (error) {
                console.error(`Error generating description for ${drillName}:`, error);
                html += `
                    <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                        <h6 class="font-semibold text-red-800">${drillName}</h6>
                        <p class="text-red-700 text-sm">Failed to generate description for this drill.</p>
                    </div>
                `;
            }
        }
        
        html += `
            </div>
            <div class="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h6 class="font-semibold text-green-800 mb-2">✅ Next Steps</h6>
                <ul class="text-green-700 text-sm space-y-1">
                    <li>• Copy descriptions you like and paste them into the practice editor</li>
                    <li>• Edit descriptions to match your coaching style</li>
                    <li>• Add specific coaching cues or safety reminders</li>
                </ul>
            </div>
        `;
        
        showAIResults(html);
        
    } catch (error) {
        console.error('Error generating descriptions:', error);
        showAIError(error.message || 'Failed to generate descriptions. Please try again.');
    }
}

async function handleSummarizeForParents() {
    if (!currentAIPractice) {
        showAIError('No practice selected. Please try again.');
        return;
    }
    
    lastAIAction = 'summarize';
    showAILoading();
    
    try {
        const summary = await aiAssistant.summarizeForParents(currentAIPractice);
        
        const html = `
            <div class="space-y-4">
                <div class="flex items-center justify-between mb-4">
                    <h5 class="font-semibold text-braves-navy">Parent Summary for Practice ${currentAIPractice.id}</h5>
                    <button onclick="copyParentSummary('${summary.replace(/'/g, "\\'")}', '${currentAIPractice.title}')" 
                            class="bg-braves-red text-white px-3 py-2 rounded text-sm hover:bg-braves-red-hover transition-all">
                        <i class="fas fa-copy mr-1"></i>Copy Summary
                    </button>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center mb-3">
                        <i class="fas fa-envelope text-braves-red mr-2"></i>
                        <span class="font-semibold text-gray-800">Ready-to-Send Message</span>
                    </div>
                    <div class="bg-white p-4 rounded border border-gray-300 font-mono text-sm text-gray-700 leading-relaxed">
                        ${summary.replace(/\n/g, '<br>')}
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h6 class="font-semibold text-blue-800 mb-2">📱 How to Use</h6>
                        <ul class="text-blue-700 text-xs space-y-1">
                            <li>• Copy the message above</li>
                            <li>• Paste into team group chat</li>
                            <li>• Send via email to parents</li>
                            <li>• Post on team communication app</li>
                        </ul>
                    </div>
                    
                    <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h6 class="font-semibold text-green-800 mb-2">✨ Benefits</h6>
                        <ul class="text-green-700 text-xs space-y-1">
                            <li>• Keeps parents engaged</li>
                            <li>• Shows practice structure</li>
                            <li>• Highlights skill development</li>
                            <li>• Professional communication</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        showAIResults(html);
        
    } catch (error) {
        console.error('Error generating parent summary:', error);
        showAIError(error.message || 'Failed to generate parent summary. Please try again.');
    }
}

function retryAIAction() {
    if (!lastAIAction) return;
    
    switch (lastAIAction) {
        case 'suggest-drills':
            handleSuggestDrills();
            break;
        case 'auto-fill':
            handleAutoFillDescriptions();
            break;
        case 'summarize':
            handleSummarizeForParents();
            break;
    }
}

function clearAIResults() {
    hideAllAIStates();
    lastAIAction = null;
}

// Helper functions for AI results
function searchVideosFromAI(searchTerm) {
    // Close AI modal and open video search
    closeAIAssistant();
    
    // Create a temporary input for video search
    const tempInput = document.createElement('input');
    tempInput.id = 'temp-ai-video-search';
    tempInput.style.display = 'none';
    document.body.appendChild(tempInput);
    
    // Trigger video search
    searchVideos('temp-ai-video-search', searchTerm);
    
    // Clean up temp input after search
    setTimeout(() => {
        const temp = document.getElementById('temp-ai-video-search');
        if (temp) temp.remove();
    }, 1000);
}

async function copyDrillToClipboard(name, description, equipment) {
    const drillText = `**${name}**\n\n${description}\n\nEquipment: ${equipment}`;
    
    try {
        await navigator.clipboard.writeText(drillText);
        showToast('Drill copied to clipboard!', 'success');
    } catch (error) {
        console.error('Failed to copy drill:', error);
        showToast('Failed to copy drill. Please try again.', 'error');
    }
}

async function copyDescriptionToClipboard(description, drillName) {
    try {
        await navigator.clipboard.writeText(description);
        showToast(`Description for "${drillName}" copied to clipboard!`, 'success');
    } catch (error) {
        console.error('Failed to copy description:', error);
        showToast('Failed to copy description. Please try again.', 'error');
    }
}

async function copyParentSummary(summary, practiceTitle) {
    try {
        await navigator.clipboard.writeText(summary);
        showToast(`Parent summary for "${practiceTitle}" copied to clipboard!`, 'success');
    } catch (error) {
        console.error('Failed to copy summary:', error);
        showToast('Failed to copy summary. Please try again.', 'error');
    }
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 transform translate-x-full`;
    
    // Set color based on type
    switch (type) {
        case 'success':
            toast.classList.add('bg-green-500');
            break;
        case 'error':
            toast.classList.add('bg-red-500');
            break;
        default:
            toast.classList.add('bg-blue-500');
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Make functions globally available
window.openVideo = openVideo;
window.closeVideo = closeVideo;
window.printPractice = printPractice;
window.selectPractice = selectPractice;
window.editPractice = editPractice;
window.savePractice = savePractice;
window.addCoach = addCoach;
window.toggleCoach = toggleCoach;
window.removeCoach = removeCoach;
window.searchVideos = searchVideos;
window.useVideo = useVideo;
window.previewVideo = previewVideo;
window.closeVideoSearch = closeVideoSearch;
window.switchTab = switchTab;
window.editCoachName = editCoachName;
window.saveCoachName = saveCoachName;
window.cancelNameEdit = cancelNameEdit;
window.openAIAssistant = openAIAssistant;
window.closeAIAssistant = closeAIAssistant;
window.handleSuggestDrills = handleSuggestDrills;
window.handleAutoFillDescriptions = handleAutoFillDescriptions;
window.handleSummarizeForParents = handleSummarizeForParents;
window.retryAIAction = retryAIAction;
window.clearAIResults = clearAIResults;
window.copyDrillToClipboard = copyDrillToClipboard;
window.copyDescriptionToClipboard = copyDescriptionToClipboard;
window.copyParentSummary = copyParentSummary;
