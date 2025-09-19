        const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
        const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
        
        let cities = JSON.parse(localStorage.getItem('weatherCities')) || [];

        const elements = {
            cityInput: document.getElementById('cityInput'),
            searchBtn: document.getElementById('searchBtn'),
            locationBtn: document.getElementById('locationBtn'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            weatherGrid: document.getElementById('weatherGrid'),
            noData: document.getElementById('noData')
        };

        function init() {
            setupEventListeners();
            if (cities.length > 0) {
                cities.forEach(city => fetchWeatherData(city));
            } else {
                showNoData();
            }
        }

        function setupEventListeners() {
            elements.searchBtn.addEventListener('click', handleSearch);
            elements.cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSearch();
            });
            elements.locationBtn.addEventListener('click', getCurrentLocation);
        }

        function showLoading() {
            elements.loading.style.display = 'flex';
            elements.error.style.display = 'none';
            elements.noData.style.display = 'none';
        }

        function hideLoading() {
            elements.loading.style.display = 'none';
        }

        function showError(message) {
            elements.error.textContent = message;
            elements.error.style.display = 'block';
            hideLoading();
        }

        function showNoData() {
            elements.noData.style.display = cities.length === 0 ? 'block' : 'none';
        }

        async function handleSearch() {
            const city = elements.cityInput.value.trim();
            if (!city) return;

            if (cities.includes(city.toLowerCase())) {
                showError('City already added!');
                return;
            }

            await fetchWeatherData(city);
            elements.cityInput.value = '';
        }

        function getCurrentLocation() {
            if (!navigator.geolocation) {
                showError('Geolocation is not supported by this browser.');
                return;
            }

            showLoading();
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await fetchWeatherByCoords(latitude, longitude);
                },
                (error) => {
                    showError('Unable to retrieve your location. Please try searching for a city.');
                    hideLoading();
                }
            );
        }

        async function fetchWeatherByCoords(lat, lon) {
            try {
                const geoResponse = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
                );
                const geoData = await geoResponse.json();
                const city = geoData.city || geoData.locality || 'Current Location';
                
                if (!cities.includes(city.toLowerCase())) {
                    await fetchWeatherDataByCoords(lat, lon, city);
                }
                hideLoading();
            } catch (error) {
                showError('Failed to fetch weather data for your location.');
            }
        }

        async function fetchWeatherData(city) {
            showLoading();
            try {
                const geoResponse = await fetch(
                    `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
                );
                
                if (!geoResponse.ok) throw new Error('City not found');
                
                const geoData = await geoResponse.json();
                if (!geoData.results || geoData.results.length === 0) {
                    throw new Error('City not found');
                }
                
                const location = geoData.results[0];
                await fetchWeatherDataByCoords(location.latitude, location.longitude, location.name);
                
            } catch (error) {
                showError(`Failed to fetch weather data for ${city}. Please check the city name.`);
            }
        }

        async function fetchWeatherDataByCoords(lat, lon, cityName) {
            try {
                const weatherResponse = await fetch(
                    `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`
                );
                
                if (!weatherResponse.ok) throw new Error('Weather data not found');
                
                const weatherData = await weatherResponse.json();
                
                const cityLower = cityName.toLowerCase();
                if (!cities.includes(cityLower)) {
                    cities.push(cityLower);
                    localStorage.setItem('weatherCities', JSON.stringify(cities));
                }
                
                renderWeatherCardOpenMeteo(weatherData, cityName);
                hideLoading();
                showNoData();
                
            } catch (error) {
                showError(`Failed to fetch weather data for ${cityName}.`);
            }
        }

        function getWeatherDescription(code) {
            const weatherCodes = {
                0: { description: 'Clear sky', icon: '☀️' },
                1: { description: 'Mainly clear', icon: '🌤️' },
                2: { description: 'Partly cloudy', icon: '⛅' },
                3: { description: 'Overcast', icon: '☁️' },
                45: { description: 'Fog', icon: '🌫️' },
                48: { description: 'Rime fog', icon: '🌫️' },
                51: { description: 'Light drizzle', icon: '🌦️' },
                53: { description: 'Moderate drizzle', icon: '🌦️' },
                55: { description: 'Dense drizzle', icon: '🌧️' },
                61: { description: 'Slight rain', icon: '🌧️' },
                63: { description: 'Moderate rain', icon: '🌧️' },
                65: { description: 'Heavy rain', icon: '🌧️' },
                71: { description: 'Slight snow', icon: '🌨️' },
                73: { description: 'Moderate snow', icon: '❄️' },
                75: { description: 'Heavy snow', icon: '❄️' },
                80: { description: 'Slight showers', icon: '🌦️' },
                81: { description: 'Moderate showers', icon: '🌧️' },
                82: { description: 'Violent showers', icon: '⛈️' },
                95: { description: 'Thunderstorm', icon: '⛈️' },
                96: { description: 'Thunderstorm with hail', icon: '⛈️' },
                99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
            };
            return weatherCodes[code] || { description: 'Unknown', icon: '🌡️' };
        }

        function renderWeatherCardOpenMeteo(data, cityName) {
            const card = document.createElement('div');
            card.className = 'weather-card';
            card.dataset.city = cityName.toLowerCase();

            const current = data.current;
            const daily = data.daily;
            
            const currentWeather = getWeatherDescription(current.weather_code);
            const windDirection = getWindDirection(current.wind_direction_10m);

            card.innerHTML = `
                <div class="city-header">
                    <div class="city-name">${cityName}</div>
                    <button class="remove-btn" onclick="removeCity('${cityName.toLowerCase()}')">&times;</button>
                </div>

                <div class="current-weather">
                    <div class="temp-info">
                        <div class="temperature">${Math.round(current.temperature_2m)}°C</div>
                        <div class="description">${currentWeather.description}</div>
                        <div class="feels-like">Feels like ${Math.round(current.apparent_temperature)}°C</div>
                    </div>
                    <div style="font-size: 4rem; margin-left: 20px;">${currentWeather.icon}</div>
                </div>

                <div class="weather-details">
                    <div class="detail-item">
                        <div class="detail-label">Humidity</div>
                        <div class="detail-value">${Math.round(current.relative_humidity_2m)}%</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Wind Speed</div>
                        <div class="detail-value">${Math.round(current.wind_speed_10m)} km/h</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Wind Direction</div>
                        <div class="detail-value">${windDirection}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Precipitation</div>
                        <div class="detail-value">${current.precipitation} mm</div>
                    </div>
                </div>

                <div class="forecast">
                    <div class="forecast-title">3-Day Forecast</div>
                    <div class="forecast-items">
                        ${daily.time.slice(1, 4).map((date, index) => {
                            const dayWeather = getWeatherDescription(daily.weather_code[index + 1]);
                            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                            return `
                                <div class="forecast-item">
                                    <div class="forecast-day">${dayName}</div>
                                    <div style="font-size: 2rem; margin: 8px 0;">${dayWeather.icon}</div>
                                    <div class="forecast-temp">${Math.round(daily.temperature_2m_max[index + 1])}° / ${Math.round(daily.temperature_2m_min[index + 1])}°</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;

            const existingCard = elements.weatherGrid.querySelector(`[data-city="${cityName.toLowerCase()}"]`);
            if (existingCard) {
                existingCard.remove();
            }

            elements.weatherGrid.appendChild(card);
        }

        function getWindDirection(degrees) {
            const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
            const index = Math.round(degrees / 22.5) % 16;
            return directions[index];
        }



        function removeCity(cityName) {
            cities = cities.filter(city => city !== cityName);
            localStorage.setItem('weatherCities', JSON.stringify(cities));
            
            const card = elements.weatherGrid.querySelector(`[data-city="${cityName}"]`);
            if (card) {
                card.remove();
            }
            
            showNoData();
        }

        init();