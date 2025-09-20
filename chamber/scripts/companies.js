import { getCompanyData } from "./companies/fetchCompanies.mjs";
import { displayCompanies } from "./companies/displayCompanies.mjs";
import { displayCard } from "./companies/displayCompanyCard.mjs";
import { displayList } from "./companies/displayCompanyList.mjs";

const gridButton = document.querySelector('#grid-btn');
const listButton = document.querySelector('#list-btn');
const companies = document.querySelector('#companies');

getCompanyData().then(data => {
    displayCompanies(data, displayCard, companies, true);

    listButton.addEventListener("click", () => displayCompanies(data, displayList, companies, true));

    gridButton.addEventListener("click", () => displayCompanies(data, displayCard, companies, true));
});