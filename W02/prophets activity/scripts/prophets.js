const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

const cards = document.querySelector('#cards');

async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();
    displayProphets(data.prophets);
}

const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        let card = document.createElement('section');
        let fullName = document.createElement('h2');
        let birthdate = document.createElement('p');
        let deathdate = document.createElement('p');
        let birthplace = document.createElement('p');
        let portrait = document.createElement('img');
        
        let name = `${prophet.name} ${prophet.lastname}`;
        fullName.textContent = name;

        birthdate.innerHTML = `<strong>Date of Birth:<strong> ${prophet.birthdate}`;
        deathdate.innerHTML = `<strong>Date of Death:<strong>${prophet.death}`;
        birthplace.innerHTML = `<strong>Place of Birth:<strong>${prophet.birthplace}`;

        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${name}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        card.appendChild(fullName);
        card.appendChild(birthdate);
        card.appendChild(deathdate);  
        card.appendChild(birthplace);
        card.appendChild(portrait);

        cards.appendChild(card);
    });
}

getProphetData();