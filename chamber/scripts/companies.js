const url = 'https://fpc25.github.io/wdd231/chamber/data/members.json';

const gridButton = document.querySelector('#grid-btn');
const listButton = document.querySelector('#list-btn');
const companies = document.querySelector('#companies');

async function getCompanyData() {
    const response = await fetch(url);
    const data = await response.json();
    displayCompanies(data.members);
}

const displayCompanies = (Companies) => {
    Companies.forEach((company) => {
        let card = document.createElement('section');
        let namePlace = document.createElement('div');
        let name = document.createElement('h2');
        let memberStatus = document.createElement('img');
        let address = document.createElement('p');

        let photoPlace = document.createElement('div');
        let logo = document.createElement('img');
        
        let infoPlace = document.createElement('div');
        let phone = document.createElement('p');
        let contact = document.createElement('p');
        let url = document.createElement('a');
        

        // populating company title
        name.textContent = `${company.name}`;
        address.textContent = `${company.address}`;

        namePlace.appendChild(name);
        namePlace.appendChild(address)

        let status = company.membershipLevel
        if (status === 3) {
            memberStatus.classList.add('gold');
        } else if (status === 2) {
            memberStatus.classList.add('silver');
        } else {
            memberStatus.classList.add('member');
        }

        memberStatus.setAttribute('src', `images/memberCard`);
        memberStatus.setAttribute('alt', `Member status card`);
        memberStatus.setAttribute('loading', 'lazy');
        memberStatus.setAttribute('width', '16');
        memberStatus.setAttribute('height', '16');

        namePlace.appendChild(memberStatus);

        // populating company logo
        logo.setAttribute(company.image);
        logo.setAttribute('alt', `${company.name} trademark`);
        logo.setAttribute('loading', 'lazy');
        logo.setAttribute('width', '1024');
        logo.setAttribute('height', '1024');

        photoPlace.appendChild(logo);

        // populating company info
        phone.innerHTML = `<strong>Phone:</strong> ${company.phone}`;
        contact.innerHTML = `<strong>Contact:</strong> ${company.contact}`;

        url.setAttribute('href', company.website);
        url.setAttribute('target', '_blank');
        url.textContent = "Company webpage";
        
        infoPlace.appendChild(phone);
        infoPlace.appendChild(contact);
        infoPlace.appendChild(url);

        // populating the card
        card.classList.add('card');

        card.appendChild(namePlace);
        card.appendChild(photoPlace);  
        card.appendChild(infoPlace);

        // populating cards
        cards.appendChild(card);
    });
}

function toggleView(view) {
    companies.classList.toggle('list', view === 'list');
    companies.classList.toggle('grid', view === 'grid');
}

getCompanyData();

listButton.addEventListener("click", () => toggleView('list'));
gridButton.addEventListener("click", () => toggleView('grid'));
