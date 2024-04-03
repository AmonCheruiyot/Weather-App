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

    // Add ad code to the sidebar
    const sidebar = document.getElementById('sidebar');
    const adContainer = document.createElement('div');
    adContainer.classList.add('ad-container');
    adContainer.innerHTML = `
        <!-- Place your ad code here -->
        <ins class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-1234567890"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    `;
    sidebar.appendChild(adContainer);
}


// Function to create a city element
function createCityElement(cityName) {
    const cityElement = document.createElement('div');
    cityElement.classList.add('city');

    const cityNameElement = document.createElement('span');
    cityNameElement.textContent = cityName;

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
    deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click event from propagating to the city element
        deleteCity(cityName);
    });

    // Add a small space between the delete icon and city name
    const space = document.createTextNode('\u00A0');

    cityElement.appendChild(deleteIcon);
    cityElement.appendChild(space); // Add space between icon and city name
    cityElement.appendChild(cityNameElement);

    cityElement.addEventListener('click', function() {
        getWeather(cityName);
    });

    return cityElement;
}

// Function to delete a city from the watched cities list
function deleteCity(cityName) {
    let watchedCities = getWatchedCities();
    watchedCities = watchedCities.filter(city => city !== cityName);
    localStorage.setItem('watchedCities', JSON.stringify(watchedCities));
    displayWatchedCities();
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

    // Add event listener for Enter key press on input field
    document.getElementById('location-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addCity();
        }
    });
}

// Run initialization when DOM content is loaded
document.addEventListener('DOMContentLoaded', initApp);
