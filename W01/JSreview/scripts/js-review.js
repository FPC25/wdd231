// Select the HTML element to manipulate
const today1 = document.querySelector('#today1');
const today2 = document.querySelector('#today2');
const message = document.querySelector('aside');
const temp = document.querySelector('#temp');
const divs = document.querySelectorAll('div');
const cNames = document.querySelector('#c-names') 

// Variables for activity use
let citynames = ["New York","Sacramento","Cleveland","South Bend","Tampa Bay","Corpus Christi"];
let volume = 409;

function getCelsius(fahrenheit) {
	return (fahrenheit - 32) * (5/9);
}

// Set up the Date format object parameter for toLocaleDateString method.
const options = {
		month: "short",
		day: "2-digit",
		year: "numeric"
	};

// Question #1
today1.innerHTML = new Date().toLocaleDateString("en-US", options);

// Question #2
today2.innerHTML = `<strong>Volume</strong>: ${volume} liters`;

// Question #3
let quantity = document.querySelector('#q').value;

// Question #4
message.innerHTML = `Welcome to <em>our</em> neighborhood!`;

// Question #5
temp.value = `${getCelsius(33).toFixed(1)} °C`;

// Question #6
document.querySelector('#divs').textContent = `Found ${divs.length} <div> elements.`;

// Question #7
let filterC = citynames.filter(city => city.charAt(0).toLowerCase() === "c");
cNames.innerHTML = filterC.join(", ");