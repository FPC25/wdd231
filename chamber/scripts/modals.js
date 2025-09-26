// Get all learn more links and close buttons
const learnMoreLinks = document.querySelectorAll('.learn-more');
const closeButtons = document.querySelectorAll('.close-modal');

// Add event listeners to open modals
learnMoreLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = link.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        modal.showModal();
    });
});

// Add event listeners to close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('dialog');
        modal.close();
    });
});

// Close modal when clicking outside of it
document.querySelectorAll('.membership-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.close();
        }
    });
});