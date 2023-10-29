// ********************************************************
// Functions
// ********************************************************

function getDate(timestamp) {
    let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    let month = months[timestamp.getMonth()];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = timestamp.getDate();
    let weekday = days[timestamp.getDay()];
    let hours = timestamp.getHours().toString().padStart(2, "0");
    let minutes = timestamp.getMinutes().toString().padStart(2, "0");
    let currentDayTime = document.querySelector("#current-day-and-time");
    currentDayTime.innerHTML = `${weekday} ${day} ${month} ${hours}:${minutes}`;
}

function getPosition(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(getWeatherForCurrentPosition);
}

function getCityForWeatherSearch(event) {
    event.preventDefault();
    // alert("you clicked submit");
    let cityInput = document.querySelector("#search-city");

    if (cityInput.value) {
        let city = cityInput.value.trim();
        getWeatherForCity(city);
    } else {
        let cityName = document.querySelector("#city");
        cityName.innerHTML = `Enter a city`;
        alert("Enter a city");
    }
}

function getWeatherForCity(city) {
    let apiUrl =
        mainApiUrl + "q=" + city + "&appid=" + apiKey + "&units=" + tempUnit;

    axios.get(apiUrl).then(showCurrentWeather);
}

function getWeatherForCurrentPosition(position) {
    let apiUrl =
        mainApiUrl +
        "&lat=" +
        position.coords.latitude +
        "&lon=" +
        position.coords.longitude +
        "&appid=" +
        apiKey +
        "&units=" +
        tempUnit;
    axios.get(apiUrl).then(showCurrentWeather);
}

function showCurrentWeather(response) {
    if (response.status === 200) {
        // change city name
        document.querySelector("#city").innerHTML = response.data.name;

        // change current condition
        let currentCondition = response.data.weather[0].description;
        document.querySelector("#current-condition").innerHTML =
            currentCondition;

        // change current condition icon
        let icon = document.querySelector("#current-icon");
        icon.setAttribute(
            "src",
            `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        );

        // change current temperature
        let currentTemperature = Math.round(response.data.main.temp);
        document.querySelector(
            "#current-temp-value"
        ).innerHTML = `${currentTemperature}`;

        // change min/max temperatures
        let minTemperature = Math.round(response.data.main.temp_min);
        document.querySelector(
            "#current-day-min-temp"
        ).innerHTML = `${minTemperature}°C`;

        let maxTemperature = Math.round(response.data.main.temp_max);
        document.querySelector(
            "#current-day-max-temp"
        ).innerHTML = `${maxTemperature}°C`;

        // change sunrise/sunset
        let timezone = response.data.timezone;
        let sunriseUnix = response.data.sys.sunrise;
        let sunsetUnix = response.data.sys.sunset;

        let sunriseTime = convertUnixTimestamptoTime(sunriseUnix, timezone);
        document.querySelector("#current-day-sunrise").innerHTML = sunriseTime;
        let sunsetTime = convertUnixTimestamptoTime(sunsetUnix, timezone);
        document.querySelector("#current-day-sunset").innerHTML = sunsetTime;

        // todo: get forecast
    } else {
        console.log(`${response.status}: Response Error`);
    }
}

function convertUnixTimestamptoTime(unixTimestamp, timezone) {
    // Convert to milliseconds and then create a new Date object
    let dateObj = new Date((unixTimestamp + timezone) * 1000);
    // Format hours with leading zeros
    let hours = dateObj.getUTCHours().toString().padStart(2, "0");
    // Format minutes with leading zeros
    let minutes = dateObj.getUTCMinutes().toString().padStart(2, "0");
    // Format seconds with leading zeros
    // let seconds = dateObj.getUTCSeconds().toString().padStart(2, "0");

    //let time = `${hours}:${minutes}:${seconds}`;
    let time = `${hours}:${minutes}`;
    return time;
}

function convertCelsiusToFahrenheit(degreesCelsius) {
    return Math.round((degreesCelsius * 9) / 5 + 32);
}

function convertFahrenheitToCelsius(degreesFahrenheit) {
    return Math.round(((degreesFahrenheit - 32) * 5) / 9);
}

function getTempsInCelsius(event) {
    event.preventDefault();
    let currentTempValue = document.querySelector("#current-temp-value");
    let currentTempValueInC = convertFahrenheitToCelsius(
        currentTempValue.innerHTML
    );
    currentTempValue.innerHTML = `${currentTempValueInC}`;

    // change current temp unit
    document.querySelector("#current-temp-unit").innerHTML = "°C";

    // add "selectedUnit" class to the element that already has the "unitC" class
    // to enable special formatting
    document.querySelector(".unitC").classList.add("selectedUnit");

    // remove "selectedUnit" class from the element that already has the "unitF" class
    // to disable special formattoing
    document.querySelector(".unitF").classList.remove("selectedUnit");
}

function getTempsInFahrenheit(event) {
    event.preventDefault();
    let currentTempValue = document.querySelector("#current-temp-value");
    let currentTempValueInF = convertCelsiusToFahrenheit(
        currentTempValue.innerHTML
    );
    currentTempValue.innerHTML = `${currentTempValueInF}`;

    // change current temp unit
    document.querySelector("#current-temp-unit").innerHTML = "°F";

    // add "selectedUnit" class to the element that already has the "unitF" class
    // to enable special formatting
    document.querySelector(".unitF").classList.add("selectedUnit");

    // remove "selectedUnit" class from element that already has the "unitC" class
    // to remove special formatting
    document.querySelector(".unitC").classList.remove("selectedUnit");
}

// ********************************************************
// Global Variables
// ********************************************************

let apiKey = "dff5c692192605ee5ed7f95b423ae857";
let mainApiUrl = "https://api.openweathermap.org/data/2.5/weather?";

let now = new Date();

let city = "Munich";
let tempUnit = "metric";

// ********************************************************
// Main program
// ********************************************************

// get current timestamp for initial page load
getDate(now);

// get weather for default city and default tempUnit for initial page load
getWeatherForCity(city);

// city search form was submitted
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", getCityForWeatherSearch);

// button "Current Location" was clicked
let btnCurrentLocation = document.querySelector("#btn-current-location");
btnCurrentLocation.addEventListener("click", getPosition);

// unit switch C was clicked
let linkUnitC = document.querySelector("#unit-c");
linkUnitC.addEventListener("click", getTempsInCelsius);

// unit switch F was clicked
let linkUnitF = document.querySelector("#unit-f");
linkUnitF.addEventListener("click", getTempsInFahrenheit);
