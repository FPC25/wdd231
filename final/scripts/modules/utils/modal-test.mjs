
export function testModal() {
    // Remove existing modal if any
    const existing = document.querySelector('.modal-overlay');
    if (existing) {
        existing.remove();
    }
    
    // Create modal directly
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 999999 !important;
        opacity: 1 !important;
        visibility: visible !important;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        ">
            <div style="
                width: 80px;
                height: 80px;
                background: #5a7454;
                border-radius: 50%;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 2rem;
            ">✓</div>
            <h3 style="margin: 0 0 1rem; color: #333;">Cálculo Salvo!</h3>
            <p style="margin: 0 0 2rem; color: #666;">Seu cálculo foi salvo com sucesso na sua coleção.</p>
            <button onclick="this.closest('.modal-overlay').remove()" style="
                background: #5a7454;
                color: white;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
            ">OK</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto close after 3 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 3000);
}

// Export the test function
window.testModal = testModal;