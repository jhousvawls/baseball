/**
 * Coach AI Assistant Module
 * Handles AI-powered coaching suggestions, drill variations, and content generation
 */

import { OPENAI_API_KEY, OPENAI_API_BASE_URL } from '../utils/constants.js';

class AIAssistant {
    constructor() {
        this.cache = new Map();
        this.isProcessing = false;
        this.requestCount = 0;
        this.lastRequestTime = 0;
        this.rateLimitDelay = 1000; // 1 second between requests
    }

    /**
     * Rate limiting to prevent API abuse
     */
    async enforceRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.rateLimitDelay) {
            const delay = this.rateLimitDelay - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        this.lastRequestTime = Date.now();
        this.requestCount++;
    }

    /**
     * Make API call to OpenAI
     */
    async callOpenAI(messages, options = {}) {
        if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
            throw new Error('OpenAI API key not configured. Please add your API key to constants.js');
        }

        await this.enforceRateLimit();

        const defaultOptions = {
            model: 'gpt-4o-mini',
            max_tokens: 800,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        };

        const requestOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(OPENAI_API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...requestOptions,
                    messages: messages
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API call failed:', error);
            throw error;
        }
    }

    /**
     * Generate cache key for requests
     */
    getCacheKey(type, input) {
        return `${type}:${input.toLowerCase().trim()}`;
    }

    /**
     * Suggest drill variations based on team struggles
     */
    async suggestDrillVariations(teamStruggles) {
        if (!teamStruggles || teamStruggles.trim().length < 10) {
            throw new Error('Please provide more specific details about what your team is struggling with.');
        }

        const cacheKey = this.getCacheKey('drills', teamStruggles);
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const prompt = `You are an experienced 6U baseball coach helping another coach. The coach says their team is struggling with: "${teamStruggles}"

Suggest 3 fun, simple, and effective drills to address this specific issue. For each drill, provide:

1. **Name**: A creative, kid-friendly drill name
2. **Description**: 2-3 sentences explaining the drill in simple terms for 6-year-olds
3. **YouTube Search**: Specific search terms to find instructional videos
4. **Equipment**: What basic equipment is needed
5. **Key Focus**: The main skill this drill develops

Format your response as a JSON array with this structure:
[
  {
    "name": "Drill Name",
    "description": "Simple description for 6-year-olds...",
    "youtubeSearch": "specific search terms",
    "equipment": "balls, cones, etc.",
    "keyFocus": "main skill developed"
  }
]

Make the drills fun, age-appropriate, and focused on participation over perfection. Emphasize positive reinforcement and keep instructions simple.`;

        try {
            const response = await this.callOpenAI([
                { role: 'system', content: 'You are a helpful 6U baseball coaching assistant. Always respond with valid JSON.' },
                { role: 'user', content: prompt }
            ], { temperature: 0.8 });

            // Parse JSON response
            let drills;
            try {
                drills = JSON.parse(response);
            } catch (parseError) {
                // Fallback: extract JSON from response if it's wrapped in text
                const jsonMatch = response.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    drills = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Invalid response format from AI');
                }
            }

            // Validate response structure
            if (!Array.isArray(drills) || drills.length === 0) {
                throw new Error('Invalid drill suggestions received');
            }

            // Cache the result
            this.cache.set(cacheKey, drills);
            
            return drills;
        } catch (error) {
            console.error('Error generating drill suggestions:', error);
            throw new Error('Unable to generate drill suggestions. Please try again or check your internet connection.');
        }
    }

    /**
     * Auto-fill descriptions for drills
     */
    async autoFillDescription(drillName, context = '') {
        if (!drillName || drillName.trim().length < 2) {
            throw new Error('Please provide a drill name.');
        }

        const cacheKey = this.getCacheKey('description', drillName + context);
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const contextInfo = context ? `\n\nAdditional context: ${context}` : '';
        
        const prompt = `Write a fun, engaging description for this 6U baseball drill: "${drillName}"${contextInfo}

Requirements:
- 2-3 sentences maximum
- Age-appropriate language for 6-year-olds
- Emphasize fun and participation over perfection
- Include specific, simple coaching cues
- Make it sound exciting and achievable
- Focus on what kids will DO, not complex techniques

Example style: "Players sit with legs apart, glove on ground between legs. Coach rolls ball slowly toward glove. Player 'chomps' the ball like an alligator eating. Emphasize keeping eye on ball and using both hands."

Write ONLY the description, no extra text or formatting.`;

        try {
            const response = await this.callOpenAI([
                { role: 'system', content: 'You are a 6U baseball coach writing practice descriptions. Be concise, fun, and age-appropriate.' },
                { role: 'user', content: prompt }
            ], { temperature: 0.6, max_tokens: 200 });

            const description = response.trim();
            
            // Cache the result
            this.cache.set(cacheKey, description);
            
            return description;
        } catch (error) {
            console.error('Error generating description:', error);
            throw new Error('Unable to generate description. Please try again.');
        }
    }

    /**
     * Summarize practice for parents
     */
    async summarizeForParents(practiceData) {
        if (!practiceData || !practiceData.title) {
            throw new Error('Practice data is required.');
        }

        const cacheKey = this.getCacheKey('summary', JSON.stringify(practiceData));
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Extract key information from practice
        const practiceInfo = {
            title: practiceData.title,
            warmup: practiceData.warmup?.title || '',
            stations: practiceData.stations?.map(s => s.name).join(', ') || '',
            finisher: practiceData.finisher?.title || '',
            homework: practiceData.homework?.title || '',
            totalTime: practiceData.totalTime || 60
        };

        const prompt = `Create an enthusiastic email summary for parents about today's baseball practice.

Practice Details:
- Title: ${practiceInfo.title}
- Warmup: ${practiceInfo.warmup}
- Skill Stations: ${practiceInfo.stations}
- Fun Finisher: ${practiceInfo.finisher}
- Homework: ${practiceInfo.homework}
- Total Time: ${practiceInfo.totalTime} minutes

Write a 3-4 sentence summary that:
- Highlights the main skills being developed
- Uses an encouraging and positive tone
- Mentions specific activities kids will enjoy
- Is ready to copy/paste into team communication
- Sounds natural and enthusiastic (not robotic)

Start with something like "Hi Braves families!" and keep it conversational and exciting.`;

        try {
            const response = await this.callOpenAI([
                { role: 'system', content: 'You are writing a friendly email to baseball parents. Be enthusiastic but natural.' },
                { role: 'user', content: prompt }
            ], { temperature: 0.7, max_tokens: 300 });

            const summary = response.trim();
            
            // Cache the result
            this.cache.set(cacheKey, summary);
            
            return summary;
        } catch (error) {
            console.error('Error generating parent summary:', error);
            throw new Error('Unable to generate parent summary. Please try again.');
        }
    }

    /**
     * Clear cache (useful for testing or memory management)
     */
    clearCache() {
        this.cache.clear();
        console.log('AI Assistant cache cleared');
    }

    /**
     * Get usage statistics
     */
    getUsageStats() {
        return {
            requestCount: this.requestCount,
            cacheSize: this.cache.size,
            isProcessing: this.isProcessing
        };
    }
}

// Create singleton instance
export const aiAssistant = new AIAssistant();

// Export class for testing
export { AIAssistant };
