export function displayCard(company) {
    let card = document.createElement('section');
        
    // populating company title
    let namePlace = document.createElement('div');
    namePlace.classList.add('name');
    let name = document.createElement('h2');
    let address = document.createElement('p');
    let memberStatusShowcase = document.createElement('div');
    let memberStatus = document.createElement('img');

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
    let photoPlace = document.createElement('div');
    photoPlace.classList.add("photo");
    let logo = document.createElement('img');

    logo.setAttribute('src', `images/${company.image}`);
    logo.setAttribute('alt', `${company.name} trademark`);
    logo.setAttribute('loading', 'lazy');
    logo.setAttribute('width', '1024');
    logo.setAttribute('height', '1024');

    photoPlace.appendChild(logo);

    // populating company info
    let infoPlace = document.createElement('div');
    infoPlace.classList.add('info')
    let phone = document.createElement('p');
    let contact = document.createElement('p');
    let url = document.createElement('a');

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

    return card;
}