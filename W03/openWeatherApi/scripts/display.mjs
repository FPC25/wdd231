// DOM elements
const temp = document.querySelector('#current-temp');
const icon = document.querySelector("#weather-icon");
const caption = document.querySelector('figcaption');

export function displayWeather(data) {
    temp.innerHTML = `${data.main.temp}&deg;C`;
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    let desc = data.weather[0].description;
}