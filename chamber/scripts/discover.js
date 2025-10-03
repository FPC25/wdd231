import { places } from "../data/places.mjs";

const showhere = document.querySelector("#allplaces");

function displayCards(places){
    places.forEach(place => {
        const card = document.createElement('div');

        const photo = document.createElement('img');
        photo.src = place.image_url;
        photo.alt = place.name;
        photo.loading = 'lazy';
        card.appendChild(photo);

        const title = document.createElement('h2');
        title.innerHTML = place.name;
        card.append(title);

        const address = document.createElement('address');
        address.innerHTML = place.address;
        card.appendChild(address);

        const description = document.createElement('p');
        description.innerHTML = place.description;
        card.appendChild(description);

        const learnMore = document.createElement('button');
        learnMore.innerHTML = `<a href='${place.site}'>Learn More</a>`;
        learnMore.type = "button";
        learnMore.classList.add('learn-more-btn');
         
        card.appendChild(learnMore);

        showhere.appendChild(card)
    });
}  

displayCards(places);