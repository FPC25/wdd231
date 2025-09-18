import { config } from '../../../scripts/openWeather.mjs';
import { displayWeather } from './display.mjs';

// Trier region coordinates 
const lat = 49.75;
const lon = 6.64;

// Importing the apiKey
const apiKey = config.appid;

// OpenWeather api
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`;
console.log(url)

// Fetching OpenWeather info
async function apiFetch() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            displayWeather(data);
        } else {
            const errorText = await response.text();
            throw new Error(errorText);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

apiFetch();