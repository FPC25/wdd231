import { config } from './openWeather.mjs';
import { apiFetch } from './fetching.mjs';
import { displayWeather } from './displayWeather.mjs';

// region coordinates 
const lat = config.latitude;
const lon = config.longitude;

// Importing the apiKey
const apiKey = config.appid;

// OpenWeather api
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`;

apiFetch(displayWeather);