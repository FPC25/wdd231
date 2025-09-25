const results = document.querySelector('#results');

const getString = window.location.search;

const myInfo = new URLSearchParams(getString)

const firstName = myInfo.get('first');
const lastName = myInfo.get('last');
const ordinance = myInfo.get('ordinance');
const date = myInfo.get('date');
const temple = myInfo.get('location');
const phoneNumber = myInfo.get('phone');
const email = myInfo.get('email');

console.log(results);


results.innerHTML = `
    <p>Appointment for ${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}</p>
    <p>Proxy ${ordinance} on ${date} in the ${capitalizeFirstLetter(temple)} Temple</p>
    <p>Your phone number: ${phoneNumber}</p>
    <p>Your email: ${email}</p>
`;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}