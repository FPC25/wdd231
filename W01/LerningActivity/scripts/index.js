// creating DOM elements 
const currentYear = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified");
const navButton = document.querySelector('#ham-btn');
const navBar = document.querySelector('#nav-bar')

// creating a new date object
const today = new Date();

// getting the current year
currentYear.textContent = today.getFullYear();

// getting the last modified date
lastModified.textContent = `Last Modification: ${document.lastModified}`;

// adding show up when clicked behavior to hamburger button 
navButton.addEventListener('click', () => {
  navButton.classList.toggle('show');
  navBar.classList.toggle('show');
});