const messagePlace = document.querySelector('#message');

function checkLastVisit() {
    const currentVisit = Date.now();

    const lastVisit = localStorage.getItem('lastVisit') ? localStorage.getItem('lastVisit') : null;
}