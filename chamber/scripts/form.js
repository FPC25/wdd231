const results = document.querySelector('#results');
const myInfo = new URLSearchParams(window.location.search)

results.innerHTML = `
    <p>Dear <strong>${capitalizeFirstLetter(myInfo.get('first'))} ${capitalizeFirstLetter(myInfo.get('last'))}</strong>,</p>
    <p>Thank you for subscribing your company, <strong>${myInfo.get('organization-name')}</strong>, as a <strong>${myInfo.get('level').toLowerCase()}</strong> level member of the São Paulo Chamber of Commerce. We are thrilled to have you join us!</p>
    <p>Your membership was successfully registered on <strong>${myInfo.get('timestamp')}</strong>.</p>
    <p>Here is the contact information you provided:</p>
    <ul>
        <li><strong>Phone:</strong> ${myInfo.get('phone')}</li>
        <li><strong>Email:</strong> ${myInfo.get('email')}</li>
    </ul>
    <p>If any of this information is incorrect, please contact us to update your details.</p>
    <p>We look forward to working with you!</p>
    <p><strong>S.P.C.C. Counsel</strong></p>
`;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}