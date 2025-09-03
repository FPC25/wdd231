const navButton = document.querySelector('#ham-btn');
const navBar = document.querySelector('#nav-bar')

navButton.addEventListener('click', () => {
  navButton.classList.toggle('show');
  navBar.classList.toggle('show');
});