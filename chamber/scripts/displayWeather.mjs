// DOM elements
const temp = document.querySelector('#current-temp');
const icon = document.querySelector("#weather-icon");
const caption = document.querySelector('figcaption');
const town = document.querySelector("#town");

export function displayWeather(data) {
    town.textContent = `${data.name}`;
    temp.innerHTML = `${data.main.temp}&deg;C`;
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    let desc = `${data.weather[0].description}`
    icon.setAttribute('SRC', iconsrc);
    icon.setAttribute('ALT', desc);
    caption.textContent = desc;
}