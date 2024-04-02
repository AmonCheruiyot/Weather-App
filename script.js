// script.js

// Function to add city to watched cities list
function addCity() {
    const city = document.getElementById('location-input').value.trim();
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    let watchedCities = getWatchedCities();
    if (watchedCities.includes(city)) {
        alert('City already added!');
        return;
    }

    watchedCities.push(city);
    localStorage.setItem('watchedCities', JSON.stringify(watchedCities));
    displayWatchedCities();
    getWeather(city);
}

// Function to get watched cities from local storage
function getWatchedCities() {
    return JSON.parse(localStorage.getItem('watchedCities')) || [];
}

// Function to display watched cities
function displayWatchedCities() {
    const watchedCities = getWatchedCities();
    const watchedCitiesElement = document.getElementById('watched-cities');

    watchedCitiesElement.innerHTML = '';
    watchedCities.forEach(city => {
        const cityElement = createCityElement(city);
        watchedCitiesElement.appendChild(cityElement);
    });
}

// Function to create a city element
function createCityElement(cityName) {
    const cityElement = document.createElement('div');
    cityElement.textContent = cityName;
    cityElement.classList.add('city');
    cityElement.addEventListener('click', function() {
        getWeather(cityName);
    });
    return cityElement;
}

// Function to fetch city image
async function getCityImage(city) {
    try {
        const response = await fetch(`https://source.unsplash.com/featured/?${city}`);
        if (!response.ok) {
            throw new Error('City image not found');
        }
        return response.url;
    } catch (error) {
        console.error('Error fetching city image:', error.message);
        return null;
    }
}

// Function to fetch weather data
async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b836a545e13103f4be5bac8de4fd070b&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();

        // Display weather details
        const weatherDetailsElement = document.getElementById('weather-details');
        weatherDetailsElement.innerHTML = `
            <p>Weather: ${data.weather[0].description}</p>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <p>Pressure: ${data.main.pressure} hPa</p>
        `;

        // Display weather icon
        const weatherIconElement = document.createElement('img');
        weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        weatherDetailsElement.appendChild(weatherIconElement);

        // Set city image as background
        const cityImageUrl = await getCityImage(city);
        if (cityImageUrl) {
            document.body.style.backgroundImage = `url(${cityImageUrl})`;
        } else {
            console.error('City image not found');
        }
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        alert('City not found. Please try again.');
    }
}

// Function to initialize the app
function initApp() {
    displayWatchedCities();
    document.getElementById('add-city-btn').addEventListener('click', addCity);
}

// Run initialization when DOM content is loaded
document.addEventListener('DOMContentLoaded', initApp);
