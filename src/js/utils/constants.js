// Application Constants
export const APP_CONFIG = {
    SUPER_ADMIN_EMAIL: 'john@ahsodesigns.com',
    YOUTUBE_API_KEY: 'AIzaSyDbFiqPG91hq5_ie2vgVQ6ex98Cp4At52U',
    YOUTUBE_API_BASE_URL: 'https://www.googleapis.com/youtube/v3/search',
    TEST_ADMIN_SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
};

export const UI_ELEMENTS = {
    PRACTICE_SELECTOR: 'practice-selector',
    PRACTICE_PLAN_DISPLAY: 'practice-plan-display',
    ADMIN_TOGGLE: 'admin-toggle',
    ADMIN_MODAL: 'admin-modal',
    ADMIN_DASHBOARD: 'admin-dashboard',
    PRACTICE_EDITOR_MODAL: 'practice-editor-modal',
    CONFIRMATION_MODAL: 'confirmation-modal',
    VIDEO_MODAL: 'video-modal',
};

export const PRACTICE_DEFAULTS = {
    WARMUP_DURATION: 5,
    STATIONS_DURATION: 45,
    FINISHER_DURATION: 8,
    WRAPUP_DURATION: 2,
    STATION_DURATION: 11,
};

export const VIDEO_SEARCH = {
    MAX_RESULTS: 5,
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
    FALLBACK_CATEGORIES: {
        hitting: [
            {
                id: { videoId: 'A-KTuOkMpjE' },
                snippet: {
                    title: 'Youth Baseball Hitting Fundamentals',
                    channelTitle: 'Baseball Training',
                    publishedAt: '2023-01-01',
                    thumbnails: {
                        medium: { url: 'https://img.youtube.com/vi/A-KTuOkMpjE/mqdefault.jpg' }
                    }
                }
            },
            {
                id: { videoId: 'ZLxiU6oSNCE' },
                snippet: {
                    title: 'Soft Toss Hitting Drills for Kids',
                    channelTitle: 'Youth Baseball Coach',
                    publishedAt: '2023-01-01',
                    thumbnails: {
                        medium: { url: 'https://img.youtube.com/vi/ZLxiU6oSNCE/mqdefault.jpg' }
                    }
                }
            }
        ],
        fielding: [
            {
                id: { videoId: 'FJP3JXZM2pE' },
                snippet: {
                    title: 'Fielding Fundamentals for Youth Baseball',
                    channelTitle: 'Baseball Academy',
                    publishedAt: '2023-01-01',
                    thumbnails: {
                        medium: { url: 'https://img.youtube.com/vi/FJP3JXZM2pE/mqdefault.jpg' }
                    }
                }
            }
        ],
        throwing: [
            {
                id: { videoId: '4lW2BrqzZog' },
                snippet: {
                    title: 'Proper Throwing Mechanics for Kids',
                    channelTitle: 'Baseball Fundamentals',
                    publishedAt: '2023-01-01',
                    thumbnails: {
                        medium: { url: 'https://img.youtube.com/vi/4lW2BrqzZog/mqdefault.jpg' }
                    }
                }
            }
        ],
        baserunning: [
            {
                id: { videoId: 'Nt8QJdUR7-w' },
                snippet: {
                    title: 'Baserunning Basics for Youth',
                    channelTitle: 'Baseball Skills',
                    publishedAt: '2023-01-01',
                    thumbnails: {
                        medium: { url: 'https://img.youtube.com/vi/Nt8QJdUR7-w/mqdefault.jpg' }
                    }
                }
            }
        ]
    }
};

export const ERROR_MESSAGES = {
    AUTH: {
        'auth/user-not-found': 'Admin account not found. Check your email address.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Invalid email address format.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'default': 'Login failed. Please check your credentials.'
    }
};
