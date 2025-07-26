// Confirmation Dialog Module
import { UI_ELEMENTS } from '../utils/constants.js';

class ConfirmationDialog {
    constructor() {
        this.modal = document.getElementById(UI_ELEMENTS.CONFIRMATION_MODAL);
        this.title = document.getElementById('confirmation-title');
        this.icon = document.getElementById('confirmation-icon');
        this.message = document.getElementById('confirmation-message');
        this.cancelBtn = document.getElementById('confirmation-cancel');
        this.confirmBtn = document.getElementById('confirmation-confirm');
        this.loading = document.getElementById('confirmation-loading');
        this.resolver = null;
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Cancel button
        this.cancelBtn.addEventListener('click', () => {
            this.resolve(false);
            this.hide();
        });

        // Confirm button
        this.confirmBtn.addEventListener('click', () => {
            this.resolve(true);
            // Don't hide modal yet - let the calling function handle it
        });

        // Close button
        document.getElementById('close-confirmation-modal').addEventListener('click', () => {
            this.resolve(false);
            this.hide();
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.resolve(false);
                this.hide();
            }
        });

        // Click outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.resolve(false);
                this.hide();
            }
        });
    }

    /**
     * Show confirmation dialog
     * @param {Object} options - Dialog options
     * @returns {Promise<boolean>} - User's choice
     */
    show({
        title = 'Confirm Action',
        message = 'Are you sure you want to perform this action?',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        type = 'warning' // 'danger', 'warning', 'info'
    }) {
        return new Promise((resolve) => {
            this.resolver = resolve;
            
            // Set content
            this.title.textContent = title;
            this.message.innerHTML = message;
            this.confirmBtn.textContent = confirmText;
            this.cancelBtn.textContent = cancelText;
            
            // Set icon and styling based on type
            this.setIconAndStyling(type);
            
            // Reset loading state
            this.loading.classList.add('hidden');
            this.confirmBtn.disabled = false;
            this.cancelBtn.disabled = false;
            
            // Show modal
            this.modal.classList.remove('hidden');
        });
    }

    setIconAndStyling(type) {
        const iconEl = this.icon.querySelector('i');
        iconEl.className = 'fas text-4xl';
        
        switch (type) {
            case 'danger':
                iconEl.classList.add('fa-exclamation-triangle', 'text-red-500');
                this.confirmBtn.className = 'flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold';
                break;
            case 'warning':
                iconEl.classList.add('fa-exclamation-triangle', 'text-yellow-500');
                this.confirmBtn.className = 'flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all font-semibold';
                break;
            case 'info':
                iconEl.classList.add('fa-info-circle', 'text-blue-500');
                this.confirmBtn.className = 'flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold';
                break;
            default:
                iconEl.classList.add('fa-exclamation-triangle', 'text-yellow-500');
                this.confirmBtn.className = 'flex-1 px-4 py-3 bg-braves-red text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold';
        }
    }

    /**
     * Show loading state in confirmation dialog
     */
    showLoading() {
        this.loading.classList.remove('hidden');
        this.confirmBtn.disabled = true;
        this.cancelBtn.disabled = true;
    }

    /**
     * Hide confirmation dialog
     */
    hide() {
        this.modal.classList.add('hidden');
        this.resolver = null;
    }

    /**
     * Resolve the promise with the user's choice
     * @param {boolean} choice - User's choice
     */
    resolve(choice) {
        if (this.resolver) {
            this.resolver(choice);
        }
    }
}

// Create and export singleton instance
const confirmationDialog = new ConfirmationDialog();

/**
 * Show confirmation dialog
 * @param {Object} options - Dialog options
 * @returns {Promise<boolean>} - User's choice
 */
export function showConfirmation(options) {
    return confirmationDialog.show(options);
}

/**
 * Show loading state in confirmation dialog
 */
export function showConfirmationLoading() {
    confirmationDialog.showLoading();
}

/**
 * Hide confirmation dialog
 */
export function hideConfirmation() {
    confirmationDialog.hide();
}

export default confirmationDialog;
