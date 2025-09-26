// creating DOM elements 
const currentYear = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified");
const timestamp = document.querySelector("#timestamp");
const submitButton = document.querySelector('input[type="submit"]');

// creating a new date object
const today = new Date();

// getting the current year
currentYear.textContent = today.getFullYear();

// getting the last modified date
lastModified.textContent = `Last Modification: ${document.lastModified}`;

// Popular o timestamp quando o botão submit for clicado
if (submitButton && timestamp) {
    submitButton.addEventListener('click', () => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        };
        timestamp.value = new Date().toLocaleString('pt-BR', options);
    });
}