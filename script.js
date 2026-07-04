//======================
// OpenWeatherMap API Key
//======================
const apiKey = "d8156acf8f9aaf0a24b673288958af3a";

//======================
// HTML Elements
//======================
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const darkBtn = document.getElementById("darkBtn");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");
const loading = document.getElementById("loading");

function setLoading(isLoading) {
    if (loading) loading.style.display = isLoading ? "block" : "none";
}

//======================
// Search Button
//======================
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter city name.");
        return;
    }

    getWeather(city);

});

//======================
// Enter Key
//======================
cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        searchBtn.click();
    }

});

//======================
// Dark Mode
//======================
darkBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

});

//======================
// Current Weather
//======================
async function getWeather(city) {

    setLoading(true);

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        cityName.innerHTML = data.name;
        temp.innerHTML = Math.round(data.main.temp) + "°C";
        description.innerHTML = capitalize(data.weather[0].description);
        humidity.innerHTML = data.main.humidity + "%";
        wind.innerHTML = data.wind.speed + " km/h";

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        getForecast(city);

    }
    catch (error) {

        cityName.innerHTML = "City Not Found";
        temp.innerHTML = "--";
        description.innerHTML = "";
        humidity.innerHTML = "--";
        wind.innerHTML = "--";

    }
    finally {

        setLoading(false);

    }

}

//======================
// Current Location
//======================
locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(success, error);

});

function success(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    getWeatherByLocation(lat, lon);

}

function error() {

    alert("Location permission denied.");

}

async function getWeatherByLocation(lat, lon) {

    setLoading(true);

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    cityName.innerHTML = data.name;
    temp.innerHTML = Math.round(data.main.temp) + "°C";
    description.innerHTML = capitalize(data.weather[0].description);
    humidity.innerHTML = data.main.humidity + "%";
    wind.innerHTML = data.wind.speed + " km/h";

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    getForecast(data.name);

    setLoading(false);

}

//======================
// 5-Day Forecast
//======================
async function getForecast(city) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error("Forecast not available");
        }

        const data = await response.json();

        const forecastContainer = document.getElementById("forecastContainer");

        forecastContainer.innerHTML = "";

        // Select one forecast per day (12:00 PM)
        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        dailyForecast.forEach(day => {

            const date = new Date(day.dt_txt);

            const weekday = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            forecastContainer.innerHTML += `
                <div class="day">
                    <p>${weekday}</p>

                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

                    <span>${Math.round(day.main.temp)}°C</span>
                </div>
            `;

        });

    }
    catch (error) {
        console.log(error);
    }

}

//======================
// Capitalize Text
//======================
function capitalize(text) {

    return text.charAt(0).toUpperCase() + text.slice(1);

}

//======================
// Default Weather
//======================
window.onload = () => {

    getWeather("Ahmedabad");

};

