export function displayList(company){
    let card = document.createElement('section');
    let name = document.createElement('h2');
    let address = document.createElement('p');
    let memberStatus = document.createElement('p');
    let contact = document.createElement('p');
    let url = document.createElement('a');

    name.textContent = `${company.name}`;
    address.textContent = `${company.address}`;
    contact.textContent = `${company.contact} | ${company.phone}`;
    url.setAttribute('href', company.website);
    url.setAttribute('target', '_blank');
    url.textContent = "Company webpage";
    let status = company.membershipLevel;
    if (status === 3) {
        memberStatus.textContent = `Membership Level: Gold`;
    } else if (status === 2) {
        memberStatus.textContent = `Membership Level: Silver`;
    } else {
        memberStatus.textContent = `Membership Level: Member`;
    }

    card.appendChild(name);
    card.appendChild(address);
    card.appendChild(memberStatus);
    card.appendChild(contact);
    card.appendChild(url);
    card.classList.add('line');
    card.classList.remove('card');
    
    return card;
}
    