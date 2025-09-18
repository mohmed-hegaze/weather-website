const API_KEY = 'a66c311a7d6d46fb949222953251709';
const API_URL = 'https://api.weatherapi.com/v1/current.json';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    try {
        weatherInfo.innerHTML = '<p>Loading...</p>';

        const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.error) {
            showError(data.error.message);
            return;
        }

        displayWeather(data);

    } catch (error) {
        showError('Failed to fetch weather data. Please try again.');
        console.error('Error:', error);
    }
}

function displayWeather(data) {
    const { location, current } = data;

    const iconUrl = current.condition.icon.startsWith('//')
        ? 'https:' + current.condition.icon
        : current.condition.icon;

    weatherInfo.innerHTML = `
        <h2>${location.name}, ${location.country}</h2>
        <div class="main-weather">
            <img src="${iconUrl}" alt="${current.condition.text}" class="weather-icon">
            <div class="temp-container">
                <h2 class="temperature">${current.temp_c}°C</h2>
                <h3>${current.condition.text}</h3>
            </div>
        </div>
        <div class="weather-details">
            <div class="weather-item">
                <h3>Temperature</h3>
                <p>${current.temp_c}°C / ${current.temp_f}°F</p>
            </div>
            <div class="weather-item">
                <h3>Feels Like</h3>
                <p>${current.feelslike_c}°C / ${current.feelslike_f}°F</p>
            </div>
            <div class="weather-item">
                <h3>Humidity</h3>
                <p>${current.humidity}%</p>
            </div>
            <div class="weather-item">
                <h3>Wind Speed</h3>
                <p>${current.wind_kph} km/h</p>
            </div>
        </div>
    `;
}

function showError(message) {
    weatherInfo.innerHTML = `
        <p class="error-message">${message}</p>
    `;
}

cityInput.addEventListener('input', () => {
    if (cityInput.value.trim() === '') {
        weatherInfo.innerHTML = '';
    }
});