// AI Assistant Module for Baseball Practice Generator
// This module provides AI-powered assistance for practice planning

export const aiAssistant = {
    // Suggest drill variations based on team struggles
    async suggestDrillVariations(teamStruggles) {
        // For now, return fallback drills since we don't have OpenAI API configured
        return this.getFallbackDrills(teamStruggles);
    },

    // Auto-fill drill descriptions
    async autoFillDescription(drillName, context) {
        // Return a basic description for now
        return this.generateBasicDescription(drillName, context);
    },

    // Summarize practice for parents
    async summarizeForParents(practice) {
        return this.generateParentSummary(practice);
    },

    // Fallback drill suggestions when AI is not available
    getFallbackDrills(teamStruggles) {
        const drillCategories = {
            hitting: [
                {
                    name: "Tee Work Fundamentals",
                    description: "Focus on proper stance, grip, and swing mechanics using a tee. Start with stationary ball contact.",
                    keyFocus: "Hitting Mechanics",
                    equipment: "Tee, balls, bats",
                    youtubeSearch: "youth baseball tee work fundamentals"
                },
                {
                    name: "Soft Toss Progression",
                    description: "Coach tosses balls underhand from the side. Focus on timing and contact point.",
                    keyFocus: "Hand-Eye Coordination",
                    equipment: "Soft balls, bats",
                    youtubeSearch: "youth baseball soft toss drills"
                }
            ],
            fielding: [
                {
                    name: "Glove Work Basics",
                    description: "Practice proper glove positioning and two-handed catches with rolled balls.",
                    keyFocus: "Fielding Fundamentals",
                    equipment: "Gloves, balls",
                    youtubeSearch: "youth baseball fielding basics"
                },
                {
                    name: "Alligator Chomps",
                    description: "Players sit with legs apart, 'chomp' rolled balls like an alligator eating.",
                    keyFocus: "Ball Tracking",
                    equipment: "Gloves, soft balls",
                    youtubeSearch: "youth baseball alligator chomp drill"
                }
            ],
            throwing: [
                {
                    name: "Step and Throw",
                    description: "Focus on stepping toward target with opposite foot before throwing.",
                    keyFocus: "Throwing Mechanics",
                    equipment: "Balls, targets",
                    youtubeSearch: "youth baseball throwing mechanics"
                },
                {
                    name: "Target Practice",
                    description: "Set up various targets and practice accuracy from different distances.",
                    keyFocus: "Accuracy",
                    equipment: "Balls, cones, buckets",
                    youtubeSearch: "youth baseball throwing accuracy"
                }
            ],
            baserunning: [
                {
                    name: "Base Running Basics",
                    description: "Practice running through first base and proper base running form.",
                    keyFocus: "Running Form",
                    equipment: "Bases",
                    youtubeSearch: "youth baseball base running"
                },
                {
                    name: "Red Light Green Light",
                    description: "Players run bases but must stop on 'red light' command.",
                    keyFocus: "Listening Skills",
                    equipment: "Bases",
                    youtubeSearch: "youth baseball base running games"
                }
            ]
        };

        // Determine which category based on struggles mentioned
        const struggles = teamStruggles.toLowerCase();
        let selectedDrills = [];

        if (struggles.includes('hit') || struggles.includes('bat') || struggles.includes('swing')) {
            selectedDrills = selectedDrills.concat(drillCategories.hitting);
        }
        if (struggles.includes('field') || struggles.includes('catch') || struggles.includes('glove')) {
            selectedDrills = selectedDrills.concat(drillCategories.fielding);
        }
        if (struggles.includes('throw') || struggles.includes('toss')) {
            selectedDrills = selectedDrills.concat(drillCategories.throwing);
        }
        if (struggles.includes('run') || struggles.includes('base')) {
            selectedDrills = selectedDrills.concat(drillCategories.baserunning);
        }

        // If no specific category found, return a mix
        if (selectedDrills.length === 0) {
            selectedDrills = [
                ...drillCategories.hitting.slice(0, 1),
                ...drillCategories.fielding.slice(0, 1),
                ...drillCategories.throwing.slice(0, 1),
                ...drillCategories.baserunning.slice(0, 1)
            ];
        }

        return selectedDrills.slice(0, 4); // Return max 4 drills
    },

    // Generate basic description for drills
    generateBasicDescription(drillName, context) {
        const drillName_lower = drillName.toLowerCase();
        
        // Basic descriptions based on drill name patterns
        if (drillName_lower.includes('tee')) {
            return "Set up tee at appropriate height. Focus on proper stance with feet shoulder-width apart. Practice smooth, level swing through the ball. Emphasize contact over power.";
        } else if (drillName_lower.includes('catch') || drillName_lower.includes('field')) {
            return "Get in ready position with knees bent and glove down. Watch the ball all the way into the glove. Use two hands whenever possible. Stay low and move feet to get in front of the ball.";
        } else if (drillName_lower.includes('throw')) {
            return "Point glove at target, step with opposite foot toward target. Bring ball up and over the top. Follow through with throwing hand finishing down and across the body.";
        } else if (drillName_lower.includes('run') || drillName_lower.includes('base')) {
            return "Run through first base, don't slow down until past the bag. Pump arms and stay low. Listen for coach instructions on when to advance to next base.";
        } else {
            return `Practice ${drillName} with focus on fundamentals. Keep it fun and encourage effort over perfection. Provide positive feedback and demonstrations as needed.`;
        }
    },

    // Generate parent summary
    generateParentSummary(practice) {
        const stationsList = practice.stations ? 
            practice.stations.map((station, index) => `${index + 1}. ${station.name}`).join('\n') : 
            'Various skill stations';

        return `🏆 Practice Update: ${practice.title}

Hi Parents!

Here's what we worked on in today's ${practice.totalTime}-minute practice:

🏃 WARM-UP (${practice.warmup?.duration || 5} mins)
${practice.warmup?.title || 'Dynamic Warm-up'}
${practice.warmup?.desc || 'Getting players ready for practice'}

⚾ SKILL STATIONS (${practice.stationTime || 30} mins)
${stationsList}

🎯 FUN FINISHER (${practice.finisher?.duration || 15} mins)
${practice.finisher?.title || 'Game Activity'}
${practice.finisher?.desc || 'Putting skills together in a fun game'}

👥 WRAP-UP (${practice.wrapup?.duration || 5} mins)
${practice.wrapup?.title || 'Team Discussion'}

🏠 HOMEWORK FOR THIS WEEK:
${practice.homework?.title || 'Practice at Home'}
${practice.homework?.desc || 'Keep practicing the skills we learned!'}

The kids are making great progress! Keep encouraging them to practice at home and have fun with baseball.

Go Braves! ⚾

Coach`;
    }
};
