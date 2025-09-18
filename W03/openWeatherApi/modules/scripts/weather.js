import { config } from '../../../scripts/OpenWeather.mjs';

// DOM elements
const temp = document.querySelector('#current-temp');
const icon = document.querySelector("#weather-icon");
const caption = document.querySelector('figcaption');

// Trier region coordinates 
const lat = 49.75;
const lon = 6.64;

// Importing the apiKey
const apiKey = config.appid

// OpenWeather api
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;

