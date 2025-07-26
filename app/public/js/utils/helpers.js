// Helper Utility Functions
import { ERROR_MESSAGES } from './constants.js';

/**
 * Get time ago string from a date
 * @param {Date} date - The date to compare
 * @returns {string} - Human readable time ago string
 */
export function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
}

/**
 * Calculate total practice time
 * @param {Object} practice - Practice object
 * @returns {number} - Total time in minutes
 */
export function calculateTotalTime(practice) {
    const warmupTime = practice.warmup?.duration || 5;
    const stationsTime = practice.stations?.reduce((sum, station) => sum + (station.duration || 11), 0) || 45;
    const finisherTime = practice.finisher?.duration || 8;
    const wrapupTime = practice.wrapup?.duration || 2;
    return warmupTime + stationsTime + finisherTime + wrapupTime;
}

/**
 * Get error message for authentication errors
 * @param {Object} error - Firebase error object
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(error) {
    return ERROR_MESSAGES.AUTH[error.code] || ERROR_MESSAGES.AUTH.default;
}

/**
 * Convert YouTube URL to embed URL
 * @param {string} url - YouTube URL
 * @returns {string} - YouTube embed URL
 */
export function getYouTubeEmbedUrl(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    if (match) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
    return url; // Return original URL if not a YouTube URL
}

/**
 * Show temporary message to user
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success', 'error', 'info')
 * @param {number} duration - Duration in milliseconds
 */
export function showMessage(message, type = 'info', duration = 3000) {
    const messageEl = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    messageEl.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white font-semibold ${bgColor}`;
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.remove();
    }, duration);
}

/**
 * Show error message in admin error container
 * @param {string} message - Error message to display
 * @param {HTMLElement} errorElement - Error container element
 */
export function showAdminError(message, errorElement) {
    if (!errorElement) {
        console.error('Error element not found for message:', message);
        return;
    }
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    setTimeout(() => {
        errorElement.classList.add('hidden');
    }, 5000);
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeHtml(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
export function extractVideoId(url) {
    if (!url) return null;
    
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

/**
 * Format date for display
 * @param {Date|Object} date - Date object or Firestore timestamp
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
    if (!date) return 'Unknown';
    
    // Handle Firestore timestamp
    if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate().toLocaleDateString();
    }
    
    // Handle regular Date object
    if (date instanceof Date) {
        return date.toLocaleDateString();
    }
    
    return 'Unknown';
}

/**
 * Generate avatar initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials (max 2 characters)
 */
export function getInitials(name) {
    if (!name) return '?';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate YouTube URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid YouTube URL
 */
export function isValidYouTubeUrl(url) {
    if (!url) return true; // Empty URLs are allowed
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
}

/**
 * Create DOM element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string|HTMLElement} content - Element content
 * @returns {HTMLElement} - Created element
 */
export function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (typeof content === 'string') {
        element.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        element.appendChild(content);
    }
    
    return element;
}
