const container = document.querySelector(".container");
const weatherDiv = document.querySelector(".weather-update");
const bottomDiv = document.querySelector(".bottom-content");
const inputBox = document.querySelector(".search");
const searchBtn = document.getElementById("Search");
const dropdownDiv = document.querySelector(".dropdown");
const dropdownbtn = document.getElementById("drop");
const City = document.querySelector("#city");
const date = document.querySelector("#date");
const weatherImage = document.querySelector("img");
const temperature = document.querySelector("#temperature");
const condition = document.getElementById("condition");
const feelValue = document.getElementById("feelValue");
const humidity = document.getElementById("humid");
const windSpeed = document.getElementById("wind");
const visibility = document.getElementById("visible");
const pressure = document.getElementById("pressureVal");

const aqiContainer = document.querySelector(".aqi-container");
const pm2 = document.getElementById("pm2_5");
const pm10 = document.getElementById("pm10");
const ozone = document.getElementById("ozone");
const nitrogen = document.getElementById("nitrogen");

const errorMsg = document.getElementById("error");

function updateDate() {
    let today = new Date();
    date.textContent = today.toDateString();

}



async function checkWeather(city) {
    const KEY = "dd694bc6dc3d693b7be0575128137566";
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}&units=metric`;
    
    const response = await fetch(`${URL}`);
    
   
    const data = await response.json();

    const AQIURL = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${KEY}`;    
    const aqi_resp = await fetch(`${AQIURL}`);
    const aqi_data = await aqi_resp.json();

    if (data.cod != 200 && aqi_data.cod!=200) {
        errorMsg.style.display = 'block';
        weatherDiv.style.display = 'none';
        bottomDiv.style.display = 'none';
        return;
    }
        errorMsg.style.display = 'none';
        weatherDiv.style.display = 'block';
        bottomDiv.style.display = 'flex';
        dropdownDiv.style.display = 'flex';

    if (!city.trim()) {
        return;
    }
    console.log(data);
    console.log();
    console.log(data.coord.lon);
    const cond = data.weather[0].main.toLowerCase();
    if (cond.includes("clear")) {
        weatherImage.src = "assets/clear.png";
    }
    else if (cond.includes("cloud")) {
        weatherImage.src = "assets/cloud.png";
    }
    else if (cond.includes("mist")) {
        weatherImage.src = "assets/mist.png";
    }
    else if (cond.includes("rain")) {
        weatherImage.src = "assets/rain.png";
    }
    else if (cond.includes("snow")) {
        weatherImage.src = "assets/snow.png";
    }
    updateDate();
    console.log(aqi_data);

        City.textContent = data.name;
        temperature.textContent = data.main.temp.toFixed(1);  
        condition.textContent = data.weather[0].description;
        feelValue.textContent = data.main.feels_like + " °C";
        humidity.textContent = data.main.humidity;
        windSpeed.textContent = (data.wind.speed * 3.6).toFixed(1); 
        visibility.textContent = (data.visibility / 1000).toFixed(1);
    pressure.textContent = data.main.pressure;
    
    if (aqi_data.list && aqi_data.list.length > 0) {
        const currentAQI = aqi_data.list[0].components;
        pm2.textContent = currentAQI.pm2_5.toFixed(1);
        pm10.textContent = currentAQI.pm10.toFixed(1);
        ozone.textContent = currentAQI.o3.toFixed(1);
        nitrogen.textContent = currentAQI.no2.toFixed(1);
        
        console.log("AQI Updated:", { pm2_5: currentAQI.pm2_5, pm10: currentAQI.pm10 });
    }

    console.log("Weather + AQI loaded for:", data.name);
};



searchBtn.addEventListener("click", () => {
    console.log("Checking Weather...");
    checkWeather(inputBox.value);
});
inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const cityInput = inputBox.value.trim();
        if (cityInput) {
            checkWeather(cityInput);
        }
    }
});
dropdownbtn.addEventListener("click", () => {
    aqiContainer.style.display = 'flex';
    dropdownDiv.style.display = 'none';
    container.style.width = "90%";
    container.style.height = "100%";
});