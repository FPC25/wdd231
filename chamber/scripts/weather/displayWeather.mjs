// DOM elements
const weatherIcon = document.querySelector('#weatherIcon');
const weatherCaption = document.querySelector('#weatherCaption');
const minMax = document.querySelector('#minMax');
const infoPlace = document.querySelector('#infoPlace');

export function displayWeather(data) {
    let main = data.main

    //getting Icon and Caption
    const iconSRC = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const desc = `${data.weather[0].description}`
    
    //Populating Icon elements
    weatherIcon.setAttribute('SRC', iconSRC);
    weatherIcon.setAttribute('ALT', desc);
    weatherCaption.textContent = desc
    minMax.innerHTML = `${main.temp_min.toFixed(0)}&deg;C / ${main.temp_max.toFixed(0)}&deg;C`;

    //Creating elements to infoPlace
    let currentTemp = document.createElement('p');
    let humidity = document.createElement('p');
    let feelsLikeTemp = document.createElement('p');

    //populating infoPlace
    currentTemp.innerHTML = `<strong>Temperature</strong>: ${main.temp.toFixed(0)}&deg;C`;
    humidity.innerHTML = `<strong>Humidity</strong>: ${main.humidity}%`;
    feelsLikeTemp.innerHTML = `<strong>Feels Like</strong>: ${main.feels_like.toFixed(0)}&deg;C`;

    infoPlace.appendChild(currentTemp);
    infoPlace.appendChild(humidity);
    infoPlace.appendChild(feelsLikeTemp);
}