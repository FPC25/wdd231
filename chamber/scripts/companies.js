import { getCompanyData } from "./fetchCompanies.mjs";
import { displayCard } from "./displayCompanyCard.mjs";
import { displayList } from "./displayCompanyList.mjs";

const gridButton = document.querySelector('#grid-btn');
const listButton = document.querySelector('#list-btn');
const companies = document.querySelector('#companies');

function cleanDisplay(companies, add, remove) {
    companies.innerHTML = '';
    companies.classList.add(add);
    companies.classList.remove(remove);
}

function displayCompanies(companiesList, add, remove, displayOption) {
    cleanDisplay(companies, add, remove);

    companiesList.forEach((company) => {
        let card = displayOption(company);

        companies.appendChild(card);
    });
}

getCompanyData().then(data => {
    displayCompanies(data, 'grid', 'list', displayCard);

    listButton.addEventListener("click", () => displayCompanies(data, 'list', 'grid', displayList));

    gridButton.addEventListener("click", () => displayCompanies(data, 'grid', 'list', displayCard));
});