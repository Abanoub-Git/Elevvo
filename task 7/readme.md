# Real-Time Weather Dashboard 🌤️

## 📌 Description

This project is a **real-time weather dashboard** that fetches and displays live weather data for multiple cities.

The dashboard includes:

- Current **temperature**, **weather condition**, and **icons**.
- A **3-day forecast** for each city.
- **Search functionality** to look up weather in different cities.
- **Loading states** while fetching API data.
- Clean, minimal, and responsive UI.

As a **bonus**, the app can detect the **user’s current location** and auto-fetch weather data for it.

---

## 🛠️ Tools & Technologies

- **HTML** → Structure of the dashboard.
- **CSS** → Styling & responsive layout.
- **JavaScript** → API requests, rendering, and interactions.
- **OpenWeatherMap API** → Real-time weather data.
- **Fetch API or Axios** → For API integration.

---

## ✨ Features

- ✅ Display current weather for multiple cities.
- ✅ Weather icons for better visualization.
- ✅ 3-day forecast with temperature & conditions.
- ✅ Search bar to get weather data by city name.
- ✅ Loading spinner/placeholder when fetching data.
- ✅ Bonus: **Auto-detect user location** with `navigator.geolocation` and fetch local weather.

---

## 📂 Project Structure

```
/weather-dashboard
│── index.html      # Main HTML file
│── style.css       # CSS styles (clean & responsive)
│── script.js       # JavaScript (API calls & DOM updates)
│── README.md       # Documentation
```

---

## 🚀 How to Run

1. Clone or download the project.
2. Open `index.html` in your browser.
3. Enter a city name in the search bar and press enter → weather data will load.
4. Allow location access to auto-fetch your current weather (bonus feature).

---

## 🔑 API Key Setup

1. Sign up at [OpenWeatherMap](https://openweathermap.org/).
2. Generate a free API key.
3. Replace the placeholder `YOUR_API_KEY` in `script.js` with your actual key:

   ```js
   const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
   const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
   ```

---

## 📱 Responsive Behavior

- **Desktop** → Weather cards arranged in grid layout.
- **Mobile** → Cards stack vertically for easy scrolling.
