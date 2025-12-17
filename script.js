const container = document.querySelector(".container");
const LoaderContainer = document.querySelector(".Loader-Container");
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
const indicatorpm25 = document.getElementById("indicator-pm25");
const indicatorpm10 = document.getElementById("indicator-pm10");
const indicatoro3 = document.getElementById("indicator-o3");
const indicatorno2 = document.getElementById("indicator-no2");
const pm25Box = indicatorpm25.parentElement;
const pm10Box = indicatorpm10.parentElement;
const o3Box = indicatoro3.parentElement;
const no2Box = indicatorno2.parentElement;

const errorMsg = document.getElementById("error");

function showLoader() {
    LoaderContainer.style.display = "flex";
    weatherDiv.style.display = "none";
    bottomDiv.style.display = "none";
    dropdownDiv.style.display = "none";
    errorMsg.style.display = "none";
}

function hideLoader() {
    LoaderContainer.style.display = "none";
}

function updateDate() {
    let today = new Date();
    date.textContent = today.toDateString();

}

async function checkWeather(city) {

    if (!city.trim()) {
        console.log("Enter valid city name");
        return;
    }

    const KEY = "dd694bc6dc3d693b7be0575128137566";
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}&units=metric`;

    try {
        showLoader();

  
        const response = await fetch(URL);
        const data = await response.json();

        if (data.cod != 200) {
            throw new Error("City not found");
        }

        const AQIURL = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${KEY}`;
        const aqi_resp = await fetch(AQIURL);
        const aqi_data = await aqi_resp.json();

        const cond = data.weather[0].main.toLowerCase();
        if (cond.includes("clear")) weatherImage.src = "assets/clear.png";
        else if (cond.includes("cloud")) weatherImage.src = "assets/cloud.png";
        else if (cond.includes("mist")) weatherImage.src = "assets/mist.png";
        else if (cond.includes("rain")) weatherImage.src = "assets/rain.png";
        else if (cond.includes("snow")) weatherImage.src = "assets/snow.png";

        updateDate();

        City.textContent = data.name;
        temperature.textContent = data.main.temp.toFixed(1);
        condition.textContent = data.weather[0].description;
        feelValue.textContent = data.main.feels_like + " °C";
        humidity.textContent = data.main.humidity;
        windSpeed.textContent = (data.wind.speed * 3.6).toFixed(1);
        visibility.textContent = (data.visibility / 1000).toFixed(1);
        pressure.textContent = data.main.pressure;

        if (aqi_data.list?.length) {
            const c = aqi_data.list[0].components;
        
            const pm25 = Number(c.pm2_5.toFixed(1));
            const pm10Value = Number(c.pm10.toFixed(1));
            const o3 = Number(c.o3.toFixed(1));
            const no2 = Number(c.no2.toFixed(1));

            indicatorpm25.style.backgroundColor = "transparent";
            indicatorpm10.style.backgroundColor = "transparent";
            indicatoro3.style.backgroundColor = "transparent";
            indicatorno2.style.backgroundColor = "transparent";

        
            // PM2.5
            pm2.textContent = pm25;
            if (pm25 <= 12) {
                indicatorpm25.style.backgroundColor = "rgb(2, 214, 2)";
                pm25Box.dataset.label = "Very Good";
                pm25Box.style.setProperty("--aqi-color", "rgb(2,214,2)");
            } else if (pm25 <= 35.4) {
                indicatorpm25.style.backgroundColor = "yellow";
                pm25Box.dataset.label = "Moderate";
                pm25Box.style.setProperty("--aqi-color", "yellow");
            } else if (pm25 <= 55.4) {
                indicatorpm25.style.backgroundColor = "rgb(255, 140, 0)";
                pm25Box.dataset.label = "Poor";
                pm25Box.style.setProperty("--aqi-color", "rgb(255,140,0)");
            } else {
                indicatorpm25.style.backgroundColor = "red";
                pm25Box.dataset.label = "Very Poor";
                pm25Box.style.setProperty("--aqi-color", "red");
            }
        
            // PM10
            pm10.textContent = pm10Value;
            if (pm10Value <= 50) {
                indicatorpm10.style.backgroundColor = "rgb(2, 214, 2)";
                pm10Box.dataset.label = "Very Good";
                pm10Box.style.setProperty("--aqi-color", "rgb(2, 214, 2)");
            } else if (pm10Value <= 100) {
                indicatorpm10.style.backgroundColor = "yellow";
                pm10Box.dataset.label = "Moderate";
                pm10Box.style.setProperty("--aqi-color", "yellow");
            } else if (pm10Value <= 250) {
                indicatorpm10.style.backgroundColor = "rgb(255, 140, 0)";
                pm10Box.dataset.label = "Poor";
                pm10Box.style.setProperty("--aqi-color", "rgb(255, 140, 0)");
            } else {
                indicatorpm10.style.backgroundColor = "red";
                pm10Box.dataset.label = "Very Poor";
                pm10Box.style.setProperty("--aqi-color", "red");
            }
        
            // Ozone
            ozone.textContent = o3;
            if (o3 <= 100) {
                indicatoro3.style.backgroundColor = "rgb(2, 214, 2)";
                o3Box.dataset.label = "Very Good";
                o3Box.style.setProperty("--aqi-color", "rgb(2,214,2)");
            } else if (o3 <= 160) {
                indicatoro3.style.backgroundColor = "yellow";
                o3Box.dataset.label = "Moderate";
                o3Box.style.setProperty("--aqi-color", "yellow");
            } else if (o3 <= 200) {
                indicatoro3.style.backgroundColor = "rgb(255, 140, 0)";
                o3Box.dataset.label = "Poor";
                o3Box.style.setProperty("--aqi-color", "rgb(255,140,0)");
            } else {
                indicatoro3.style.backgroundColor = "red";
                o3Box.dataset.label = "Very Poor";
                o3Box.style.setProperty("--aqi-color", "red");
            }
        
            // NO2
            nitrogen.textContent = no2;
            if (no2 <= 40) {
                indicatorno2.style.backgroundColor = "rgb(2, 214, 2)";
                no2Box.dataset.label = "Very Good";
                no2Box.style.setProperty("--aqi-color", "rgb(2,214,2)");
            } else if (no2 <= 80) {
                indicatorno2.style.backgroundColor = "yellow";
                no2Box.dataset.label = "Moderate";
                no2Box.style.setProperty("--aqi-color", "yellow");
            } else if (no2 <= 180) {
                indicatorno2.style.backgroundColor = "rgb(255, 140, 0)";
                no2Box.dataset.label = "Poor";
                no2Box.style.setProperty("--aqi-color", "rgb(255,140,0)");
            } else {
                indicatorno2.style.backgroundColor = "red";
                no2Box.dataset.label = "Very Poor";
                no2Box.style.setProperty("--aqi-color", "red");
            }
        }
        

        errorMsg.style.display = "none";
        weatherDiv.style.display = "block";
        bottomDiv.style.display = "flex";
        dropdownDiv.style.display = "flex";

    } catch (error) {
        errorMsg.style.display = "block";
        weatherDiv.style.display = "none";
        bottomDiv.style.display = "none";
        dropdownDiv.style.display = "none";

    } finally {
        hideLoader();
    }
}



searchBtn.addEventListener("click", () => {
    const cityInput = inputBox.value;
    if (!cityInput) {
        alert("PLease Fill the Input Field First !");
        return;
    }
    console.log("Checking Weather...");
    checkWeather(inputBox.value);
});
inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const cityInput = inputBox.value;
        if (cityInput) {
            checkWeather(cityInput);
        } else {
            alert("PLease Fill the Input Field First !");
            return;
        }
    }
});
dropdownbtn.addEventListener("click", () => {
    aqiContainer.style.display = 'flex';
    dropdownDiv.style.display = 'none';
    container.style.width = "90%";
    container.style.height = "100%";
});