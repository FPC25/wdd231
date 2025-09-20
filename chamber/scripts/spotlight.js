import { getCompanyData } from "./companies/fetchCompanies.mjs";
import { randomMember } from "./companies/randomMember.mjs";
import { displayCompanies } from "./companies/displayCompanies.mjs";
import { displayCard } from "./companies/displayCompanyCard.mjs";

const companies = document.querySelector('#spotlight');

getCompanyData().then(data => {
    const highMembers = data.filter(member => member.membershipLevel > 1);
    displayCompanies(randomMember(highMembers, 3), displayCard, companies)
});