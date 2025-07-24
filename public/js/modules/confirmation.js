export function showConfirmation(title, message, onConfirm, onCancel = null) {
    const modal = document.getElementById('confirmation-modal');
    const titleElement = document.getElementById('confirmation-title');
    const messageElement = document.getElementById('confirmation-message');
    const confirmButton = document.getElementById('confirmation-confirm');
    const cancelButton = document.getElementById('confirmation-cancel');
    const closeButton = document.getElementById('close-confirmation-modal');
    
    if (!modal) return;
    
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    // Remove existing event listeners
    const newConfirmButton = confirmButton.cloneNode(true);
    const newCancelButton = cancelButton.cloneNode(true);
    const newCloseButton = closeButton.cloneNode(true);
    
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
    cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
    closeButton.parentNode.replaceChild(newCloseButton, closeButton);
    
    // Add new event listeners
    newConfirmButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        if (onConfirm) onConfirm();
    });
    
    newCancelButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        if (onCancel) onCancel();
    });
    
    newCloseButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        if (onCancel) onCancel();
    });
    
    modal.classList.remove('hidden');
}
