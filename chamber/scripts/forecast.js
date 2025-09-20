import { config } from './openWeather.mjs';
import { apiFetch } from './fetching.mjs';
import { displayForecast } from './displayForecast.mjs';

// region coordinates 
const lat = config.latitude;
const lon = config.longitude;

// Importing the apiKey
const apiKey = config.appid;

// OpenWeather api
const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en&cnt=2`;

apiFetch(displayForecast);