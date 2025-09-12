// creating DOM elements 
const navButton = document.querySelector('#ham-btn');
const navBar = document.querySelector('#nav-bar');
const header = document.querySelector('header')

// adding show up when clicked behavior to hamburger button 
navButton.addEventListener('click', () => {
  navButton.classList.toggle('show');
  header.classList.toggle('no-border',
  navBar.classList.toggle('show'));
});