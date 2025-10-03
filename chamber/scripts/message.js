const messagePlace = document.querySelector('#message');

function checkLastVisit() {
    const currentVisit = Date.now();

    const lastVisit = localStorage.getItem('lastVisit') ? localStorage.getItem('lastVisit') : null;

    let message = '';

    if (lastVisit === null) {
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const daysBetween = Math.floor((currentVisit - parseInt(lastVisit)) / (1000 * 60 * 60 * 24))

        if (daysBetween < 1) {
            message = "Back so soon! Awesome!";
        } else if (daysBetween === 1) {
            message = "You last visited 1 day ago.";
        } else {
            message = `You last visited ${daysBetween} days ago.`;
        }
    }


    messagePlace.innerHTML = `
    <div class="visit-message-card">
        <h3>Visit Information</h3>
        <p>${message}</p>
    </div>
    `;

    localStorage.setItem('lastVisit', currentVisit.toString());
}

document.addEventListener('DOMContentLoaded', checkLastVisit);