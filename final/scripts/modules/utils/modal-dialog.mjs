// Modal Dialog Utility
// Provides a reusable modal dialog system for notifications and confirmations

let modalContainer = null;

/**
 * Initialize the modal system by creating the modal container
 */
function initializeModal() {
    if (modalContainer) return;
    
    modalContainer = document.createElement('div');
    modalContainer.className = 'modal-overlay';
    modalContainer.innerHTML = `
        <div class="modal-dialog">
            <button class="modal-close" aria-label="Close">&times;</button>
            <div class="modal-content">
                <div class="modal-icon">
                    <span class="icon-symbol">✓</span>
                </div>
                <h3 class="modal-title">Título</h3>
                <div class="modal-body">
                    <p class="modal-message">Mensagem</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn modal-btn-primary">OK</button>
                    <button class="modal-btn modal-btn-secondary" style="display: none;">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Add event listeners
    setupModalEvents();
}

/**
 * Setup event listeners for modal interactions
 */
function setupModalEvents() {
    const overlay = modalContainer;
    const closeBtn = modalContainer.querySelector('.modal-close');
    const primaryBtn = modalContainer.querySelector('.modal-btn-primary');
    const secondaryBtn = modalContainer.querySelector('.modal-btn-secondary');
    
    // Close modal when clicking overlay (outside dialog)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Close modal when clicking close button
    closeBtn.addEventListener('click', closeModal);
    
    // Handle keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Show a notification modal (info message with single OK button)
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {string} type - Modal type ('success', 'error', 'info', 'warning')
 * @returns {Promise} - Resolves when modal is closed
 */
export function showNotification(title, message, type = 'info') {
    return new Promise((resolve) => {

        
        initializeModal();
        
        const titleEl = modalContainer.querySelector('.modal-title');
        const messageEl = modalContainer.querySelector('.modal-message');
        const primaryBtn = modalContainer.querySelector('.modal-btn-primary');
        const secondaryBtn = modalContainer.querySelector('.modal-btn-secondary');
        const dialog = modalContainer.querySelector('.modal-dialog');
        const iconSymbol = modalContainer.querySelector('.icon-symbol');
        
        // Set content
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        // Set icon based on type
        const icons = {
            'success': '✓',
            'error': '✕',
            'warning': '⚠',
            'info': 'ℹ'
        };
        iconSymbol.textContent = icons[type] || icons.info;
        
        // Reset styles and hide secondary button
        dialog.className = `modal-dialog modal-${type}`;
        secondaryBtn.style.display = 'none';
        primaryBtn.textContent = 'OK';
        
        // Setup primary button action
        primaryBtn.onclick = () => {
            closeModal();
            resolve(true);
        };
        
        // Show modal
        showModal();
    });
}

/**
 * Show a confirmation modal (question with OK/Cancel buttons)
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {string} confirmText - Text for confirm button (default: 'OK')
 * @param {string} cancelText - Text for cancel button (default: 'Cancel')
 * @returns {Promise<boolean>} - Resolves with true if confirmed, false if cancelled
 */
export function showConfirmation(title, message, confirmText = 'OK', cancelText = 'Cancel') {
    return new Promise((resolve) => {
        
        initializeModal();
        
        const titleEl = modalContainer.querySelector('.modal-title');
        const messageEl = modalContainer.querySelector('.modal-message');
        const primaryBtn = modalContainer.querySelector('.modal-btn-primary');
        const secondaryBtn = modalContainer.querySelector('.modal-btn-secondary');
        const dialog = modalContainer.querySelector('.modal-dialog');
        const iconSymbol = modalContainer.querySelector('.icon-symbol');
        
        // Set content
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        // Set question mark icon for confirmation
        iconSymbol.textContent = '?';
        
        // Setup buttons
        dialog.className = 'modal-dialog modal-confirmation';
        primaryBtn.textContent = confirmText;
        secondaryBtn.textContent = cancelText;
        secondaryBtn.style.display = 'inline-block';
        
        // Setup button actions
        primaryBtn.onclick = () => {
            closeModal();
            resolve(true);
        };
        
        secondaryBtn.onclick = () => {
            closeModal();
            resolve(false);
        };
        
        // Show modal
        showModal();
    });
}

/**
 * Show the modal
 */
function showModal() {
    if (!modalContainer) return;
    
    modalContainer.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Focus on the primary button
    setTimeout(() => {
        const primaryBtn = modalContainer.querySelector('.modal-btn-primary');
        if (primaryBtn) {
            primaryBtn.focus();
        }
    }, 100);
}

/**
 * Close the modal
 */
function closeModal() {
    if (!modalContainer) return;
    
    modalContainer.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Convenience functions for specific notification types
export const notification = {
    success: (title, message) => showNotification(title, message, 'success'),
    error: (title, message) => showNotification(title, message, 'error'),
    info: (title, message) => showNotification(title, message, 'info'),
    warning: (title, message) => showNotification(title, message, 'warning')
};