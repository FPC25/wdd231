// DOM elements
const weatherIcon = document.querySelector('#weatherIcon');
const weatherCaption = document.querySelector('#weatherCaption');
const infoPlace = document.querySelector('#infoPlace');

export function displayWeather(data) {
    
    //getting Icon and Caption
    const iconSRC = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const desc = `${data.weather[0].description}`
    
    //Populating Icon elements
    weatherIcon.setAttribute('SRC', iconSRC);
    weatherIcon.setAttribute('ALT', desc);
    weatherCaption.textContent = desc

    //Creating elements to infoPlace
    let currentTemp = document.createElement('p');
    let humidity = document.createElement('p');
    let feelsLikeTemp = document.createElement('p');

    //populating infoPlace
    let main = data.main
    currentTemp.innerHTML = `<strong>Temperature</strong>: ${main.temp}&deg;C`;
    humidity.innerHTML = `<strong>Humidity</strong>:${main.humidity}%`;
    feelsLikeTemp.innerHTML = `<strong>Feels Like</strong>:${main.humidity}&deg;C`;

    infoPlace.appendChild(currentTemp);
    infoPlace.appendChild(humidity);
    infoPlace.appendChild(feelsLikeTemp);
}