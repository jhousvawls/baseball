// Video Search Module - Unified YouTube API Integration
import { YOUTUBE_API_KEY, YOUTUBE_API_BASE_URL, VIDEO_SEARCH } from '../utils/constants.js';

/**
 * Video Search Manager Class
 * Handles YouTube API integration, caching, and fallback videos
 */
export class VideoSearchManager {
    constructor() {
        this.cache = new Map();
        this.currentSearchTarget = null;
    }

    /**
     * Search for YouTube videos based on drill name
     * @param {string} drillName - Name of the drill to search for
     * @param {number} maxResults - Maximum number of results to return
     * @returns {Promise<Array>} - Array of video objects
     */
    async searchVideos(drillName, maxResults = VIDEO_SEARCH.MAX_RESULTS) {
        const cacheKey = drillName.toLowerCase();
        const cachedResult = this.cache.get(cacheKey);
        
        // Return cached results if available and not expired
        if (cachedResult && this.isCacheValid(cachedResult.timestamp)) {
            console.log('✅ Using cached results for:', drillName);
            return cachedResult.videos;
        }

        const searchQuery = `${drillName} youth baseball drill kids training`;
        const params = new URLSearchParams({
            part: 'snippet',
            q: searchQuery,
            type: 'video',
            videoDuration: 'short',
            videoSyndicated: 'true',
            safeSearch: 'strict',
            maxResults: maxResults * 2, // Get more to filter down
            order: 'relevance',
            key: YOUTUBE_API_KEY
        });

        const fullUrl = `${YOUTUBE_API_BASE_URL}?${params}`;
        console.log('🔍 YOUTUBE API - Searching for:', searchQuery);

        try {
            const response = await fetch(fullUrl);
            console.log('🔍 YOUTUBE API - Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('🚨 YOUTUBE API ERROR:', response.status, errorText);
                return this.getFallbackVideos(drillName);
            }
            
            const data = await response.json();
            console.log('✅ YOUTUBE API SUCCESS - Found', data.items?.length || 0, 'videos');
            
            if (!data.items || data.items.length === 0) {
                console.warn('⚠️ YOUTUBE API - No items returned');
                return this.getFallbackVideos(drillName);
            }
            
            const filteredVideos = this.filterVideoResults(data.items);
            const limitedResults = filteredVideos.slice(0, maxResults);
            
            // Cache the results
            this.cache.set(cacheKey, {
                videos: limitedResults,
                timestamp: Date.now()
            });
            
            return limitedResults;
        } catch (error) {
            console.error('🚨 YOUTUBE API FETCH ERROR:', error);
            return this.getFallbackVideos(drillName);
        }
    }

    /**
     * Filter video results for youth-appropriate content
     * @param {Array} videos - Raw video results from YouTube API
     * @returns {Array} - Filtered video results
     */
    filterVideoResults(videos) {
        return videos.filter(video => {
            const title = video.snippet.title.toLowerCase();
            const description = video.snippet.description?.toLowerCase() || '';
            const channelTitle = video.snippet.channelTitle.toLowerCase();
            
            // Include baseball-related terms
            const baseballTerms = ['baseball', 'drill', 'youth', 'kids', 'training', 'practice', 'coaching', 'little league'];
            const hasBaseballContent = baseballTerms.some(term => 
                title.includes(term) || description.includes(term) || channelTitle.includes(term)
            );
            
            // Exclude inappropriate content
            const excludeTerms = ['injury', 'accident', 'fail', 'blooper', 'fight', 'argument', 'ejected'];
            const hasInappropriateContent = excludeTerms.some(term => 
                title.includes(term) || description.includes(term)
            );
            
            return hasBaseballContent && !hasInappropriateContent;
        });
    }

    /**
     * Get fallback videos when API fails or returns no results
     * @param {string} drillName - Name of the drill
     * @returns {Array} - Array of fallback video objects
     */
    getFallbackVideos(drillName) {
        console.log('📦 Using fallback videos for:', drillName);
        
        const drillLower = drillName.toLowerCase();
        let category = 'hitting';
        
        if (drillLower.includes('field') || drillLower.includes('catch') || drillLower.includes('glove')) {
            category = 'fielding';
        } else if (drillLower.includes('throw') || drillLower.includes('arm')) {
            category = 'throwing';
        } else if (drillLower.includes('run') || drillLower.includes('base') || drillLower.includes('steal')) {
            category = 'baserunning';
        }

        return VIDEO_SEARCH.FALLBACK_CATEGORIES[category] || VIDEO_SEARCH.FALLBACK_CATEGORIES.hitting;
    }

    /**
     * Check if cached result is still valid
     * @param {number} timestamp - Cache timestamp
     * @returns {boolean} - True if cache is still valid
     */
    isCacheValid(timestamp) {
        return (Date.now() - timestamp) < VIDEO_SEARCH.CACHE_DURATION;
    }

    /**
     * Clear the video search cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Video search cache cleared');
    }

    /**
     * Open inline video search interface
     * @param {string} drillName - Name of the drill to search for
     * @param {string} targetInputId - ID of the input field to populate
     * @param {string} containerId - ID of the search results container
     */
    async openInlineSearch(drillName, targetInputId, containerId) {
        console.log('🎯 INLINE SEARCH - Starting search for:', drillName);
        
        this.currentSearchTarget = targetInputId;
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('❌ CONTAINER NOT FOUND:', containerId);
            return;
        }
        
        container.classList.remove('hidden');
        this.showSearchState(container, 'loading');
        
        try {
            const videos = await this.searchVideos(drillName);
            console.log('📡 SEARCH COMPLETE - Found', videos.length, 'videos');
            
            if (videos.length === 0) {
                this.showSearchState(container, 'no-results');
            } else {
                this.displaySearchResults(container, videos);
                this.showSearchState(container, 'results');
            }
        } catch (error) {
            console.error('❌ SEARCH ERROR:', error);
            this.showSearchState(container, 'error');
        }
    }

    /**
     * Show different states of the search interface
     * @param {HTMLElement} container - Search container element
     * @param {string} state - State to show ('loading', 'results', 'error', 'no-results')
     */
    showSearchState(container, state) {
        console.log('🔄 STATE CHANGE - Setting state to:', state);
        
        const loadingEl = container.querySelector('.search-loading');
        const resultsEl = container.querySelector('.search-results');
        const errorEl = container.querySelector('.search-error');
        const noResultsEl = container.querySelector('.search-no-results');
        
        // Hide all states
        [loadingEl, resultsEl, errorEl, noResultsEl].forEach(el => {
            if (el) el.classList.add('hidden');
        });
        
        // Show requested state
        switch (state) {
            case 'loading':
                loadingEl?.classList.remove('hidden');
                break;
            case 'results':
                resultsEl?.classList.remove('hidden');
                break;
            case 'error':
                errorEl?.classList.remove('hidden');
                break;
            case 'no-results':
                noResultsEl?.classList.remove('hidden');
                break;
        }
    }

    /**
     * Display search results in the container
     * @param {HTMLElement} container - Search container element
     * @param {Array} videos - Array of video objects
     */
    displaySearchResults(container, videos) {
        const resultsEl = container.querySelector('.search-results');
        if (!resultsEl) return;
        
        resultsEl.innerHTML = '';
        
        videos.forEach(video => {
            const videoCard = this.createVideoResultCard(video);
            resultsEl.appendChild(videoCard);
        });
    }

    /**
     * Create a video result card element
     * @param {Object} video - Video object from YouTube API
     * @returns {HTMLElement} - Video card element
     */
    createVideoResultCard(video) {
        const card = document.createElement('div');
        card.className = 'video-result-card cursor-pointer p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0';
        
        const thumbnail = video.snippet.thumbnails.medium || video.snippet.thumbnails.default;
        const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
        const title = video.snippet.title;
        const channelTitle = video.snippet.channelTitle;
        
        card.innerHTML = `
            <div class="flex space-x-3">
                <div class="flex-shrink-0">
                    <img src="${thumbnail.url}" alt="Video thumbnail" 
                         class="w-16 h-12 object-cover rounded">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-sm text-gray-900 mb-1 line-clamp-2">${title}</h4>
                    <p class="text-xs text-gray-500 mb-2">${channelTitle}</p>
                    <div class="flex space-x-2">
                        <button class="use-video-btn bg-braves-red text-white px-3 py-1 rounded text-xs font-medium hover:bg-opacity-90 transition-all"
                                data-video-url="${videoUrl}">
                            <i class="fas fa-check mr-1"></i>Use
                        </button>
                        <button class="preview-video-btn bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-300 transition-all"
                                data-video-url="${videoUrl}" data-video-title="${title.replace(/'/g, "\\'")}">
                            <i class="fas fa-eye mr-1"></i>Preview
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const useBtn = card.querySelector('.use-video-btn');
        const previewBtn = card.querySelector('.preview-video-btn');
        
        useBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectVideo(videoUrl);
        });
        
        previewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.previewVideo(videoUrl, title);
        });
        
        return card;
    }

    /**
     * Select a video and populate the target input field
     * @param {string} videoUrl - YouTube video URL
     */
    selectVideo(videoUrl) {
        if (this.currentSearchTarget) {
            const targetInput = document.getElementById(this.currentSearchTarget);
            if (targetInput) {
                targetInput.value = videoUrl;
                targetInput.dispatchEvent(new Event('input'));
            }
        }
        
        this.closeSearch();
    }

    /**
     * Preview a video (opens video modal or new tab)
     * @param {string} videoUrl - YouTube video URL
     * @param {string} title - Video title
     */
    previewVideo(videoUrl, title) {
        // Try to use existing video modal if available
        if (typeof window.openVideo === 'function') {
            window.openVideo(videoUrl, title);
        } else {
            // Fallback to opening in new tab
            window.open(videoUrl, '_blank');
        }
    }

    /**
     * Close the video search interface
     */
    closeSearch() {
        document.querySelectorAll('.video-search-container').forEach(container => {
            container.classList.add('hidden');
        });
        
        this.currentSearchTarget = null;
    }
}

// Create and export a singleton instance
export const videoSearchManager = new VideoSearchManager();

// Export individual functions for backward compatibility
export async function searchVideos(drillName, maxResults) {
    return videoSearchManager.searchVideos(drillName, maxResults);
}

export function filterVideoResults(videos) {
    return videoSearchManager.filterVideoResults(videos);
}

export function getFallbackVideos(drillName) {
    return videoSearchManager.getFallbackVideos(drillName);
}

export async function openInlineVideoSearch(drillName, targetInputId, containerId) {
    return videoSearchManager.openInlineSearch(drillName, targetInputId, containerId);
}

export function closeInlineVideoSearch() {
    videoSearchManager.closeSearch();
}

export function selectInlineVideo(videoUrl) {
    videoSearchManager.selectVideo(videoUrl);
}

export function previewInlineVideo(videoUrl, title) {
    videoSearchManager.previewVideo(videoUrl, title);
}
