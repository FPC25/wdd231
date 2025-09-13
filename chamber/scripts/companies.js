const url = 'https://fpc25.github.io/wdd231/chamber/data/members.json';

const gridButton = document.querySelector('#grid-btn');
const listButton = document.querySelector('#list-btn');
const companies = document.querySelector('#companies');

async function getCompanyData() {
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

const displayGridCompanies = (Companies) => {
    // Limpa o container e define classes
    companies.innerHTML = '';
    companies.classList.add('grid');
    companies.classList.remove('list');

    Companies.forEach((company) => {
        let card = document.createElement('section');

        let namePlace = document.createElement('div');
        namePlace.classList.add('name');
        let name = document.createElement('h2');
        let address = document.createElement('p');
        let memberStatusShowcase = document.createElement('div');
        let memberStatus = document.createElement('img');

        let photoPlace = document.createElement('div');
        photoPlace.classList.add("photo");
        let logo = document.createElement('img');
        
        let infoPlace = document.createElement('div');
        infoPlace.classList.add('info')
        let phone = document.createElement('p');
        let contact = document.createElement('p');
        let url = document.createElement('a');

        // populating company title
        name.textContent = `${company.name}`;
        address.textContent = `${company.address}`;

        namePlace.appendChild(name);
        namePlace.appendChild(address);

        let status = company.membershipLevel;
        if (status === 3) {
            memberStatus.setAttribute('src', `images/goldCard.svg`);
            memberStatus.classList.add('gold');
        } else if (status === 2) {
            memberStatus.setAttribute('src', `images/silverCard.svg`);
            memberStatus.classList.add('silver');
        } else {
            memberStatus.setAttribute('src', `images/memberCard.svg`);
            memberStatus.classList.add('member');
        }
        
        memberStatus.setAttribute('alt', `Member status card`);
        memberStatus.setAttribute('loading', 'lazy');
        memberStatus.setAttribute('width', '16');
        memberStatus.setAttribute('height', '16');
        memberStatusShowcase.appendChild(memberStatus);

        namePlace.appendChild(memberStatusShowcase);

        // populating company logo
        logo.setAttribute('src', `images/${company.image}`);
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

        // adding the card class
        card.classList.add('card');
        card.classList.remove('line');

        card.appendChild(namePlace);
        card.appendChild(photoPlace);  
        card.appendChild(infoPlace);

        // populating cards
        companies.appendChild(card);
    });
}

const displayListCompanies = (Companies) => {
    // Limpa o container e define classes
    companies.innerHTML = '';
    companies.classList.add('list');
    companies.classList.remove('grid');

    Companies.forEach((company) => {
        let card = document.createElement('section');
        let name = document.createElement('h2');
        let address = document.createElement('p');
        let memberStatus = document.createElement('p');
        let phone = document.createElement('p');
        let contact = document.createElement('p');
        let url = document.createElement('a');

        name.textContent = `${company.name}`;
        address.textContent = `${company.address}`;
        phone.textContent = `${company.phone}`;
        contact.textContent = `${company.contact}`;

        url.setAttribute('href', company.website);
        url.setAttribute('target', '_blank');
        url.textContent = "Company webpage";

        let status = company.membershipLevel;
        if (status === 3) {
            memberStatus.textContent = `Gold`;
        } else if (status === 2) {
            memberStatus.textContent = `Silver`;
        } else {
            memberStatus.textContent = `Member`;
        }

        card.appendChild(name);
        card.appendChild(address);
        card.appendChild(memberStatus);
        card.appendChild(phone);
        card.appendChild(contact);
        card.appendChild(url);

        card.classList.add('line');
        card.classList.remove('card');

        // populating cards
        companies.appendChild(card);
    });
}

getCompanyData().then(data => {
    displayGridCompanies(data);

    listButton.addEventListener("click", () => displayListCompanies(data));

    gridButton.addEventListener("click", () => displayGridCompanies(data));
});