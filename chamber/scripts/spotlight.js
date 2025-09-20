import { getCompanyData } from "./fetchCompanies.mjs";
import { randomMember } from "./ramdomMember.mjs";
import { displayCompanies } from "./displayCompanies.mjs";
import { displayCard } from "./displayCompanyCard.mjs";

const companies = document.querySelector('#spotlight');

getCompanyData().then(data => {
    const highMembers = data.filter(member => member.membershipLevel > 1);
    console.table(highMembers);
    displayCompanies(randomMember(highMembers, 3), displayCard, companies)
});