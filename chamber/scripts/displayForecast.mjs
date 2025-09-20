import { getMinMax } from "./minMaxForecast.mjs";

// DOM elements
const forecastInfo = document.querySelector('#forecast');

function minMaxFormat(forecast, index) {
    return `<strong>${forecast[index].weekday}</strong>: ${forecast[index].min_temp.toFixed(0)}&deg;C / ${forecast[index].max_temp.toFixed(0)}&deg;C`;
}

export function displayForecast(data) {
    const forecast = getMinMax(data);
    
    let tomorrow = document.createElement('p');
    let after = document.createElement('p');
    let afterAfter = document.createElement('p');

    tomorrow.innerHTML = minMaxFormat(forecast, 0);
    after.innerHTML = minMaxFormat(forecast, 1);
    afterAfter.innerHTML = minMaxFormat(forecast, 2);

    forecastInfo.appendChild(tomorrow);
    forecastInfo.appendChild(after);
    forecastInfo.appendChild(afterAfter);
}