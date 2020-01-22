const cityInputEl = document.querySelector('#city-input');
const submitBtnEl = document.querySelector('#city-submit');
const dashboardEl = document.querySelector('.city-forecast');
const savedCitiesEl = document.querySelector('.saved-cities');


const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
let city = '';
const auth = "&appid=fbe457a4568f0bd33f8aea7d30a321e7"
const dataType = '&units=imperial'
let citiesArr = JSON.parse(window.localStorage.getItem('cities'));
if (citiesArr == null) {
    citiesArr = [];
}
renderCities();

function getWeatherData(fullWeatherUrl, fullForecastUrl){
    fetch(fullWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);
            populateTodaysForecast(json);
        });

    fetch(fullForecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);
            populate5DayForecast(json);
        });

}

submitBtnEl.addEventListener('click', function(event){
    event.preventDefault();

    let userCityName = cityInputEl.value.trim();
    city = userCityName;
    console.log(city);
    const fullForecastUrl = forecastUrl + city + auth + dataType;
    const fullWeatherUrl = weatherUrl + city + auth + dataType;
    citiesArr.push(userCityName);

    window.localStorage.setItem('cities', JSON.stringify(citiesArr));

    getWeatherData(fullWeatherUrl,fullForecastUrl);
    renderCities();

})

function renderCities() {
    let citiesArr = JSON.parse(window.localStorage.getItem('cities'));
    if (citiesArr == null) {
        citiesArr = [];
    }
    savedCitiesEl.innerHTML = '';

    for (let i = 0; i < citiesArr.length; i++) {
        let newBtn = document.createElement('button');
        newBtn.setAttribute('class', 'city');
        newBtn.setAttribute('data-name', citiesArr[i]);
        newBtn.textContent = citiesArr[i];
        savedCitiesEl.append(newBtn);
    }
}


function populateTodaysForecast(obj) {
    const cityName = document.createElement('h2');
    cityName.textContent = obj.name;
    dashboardEl.append(cityName);
    
    const cityTemp = document.createElement('p');
    cityTemp.textContent = `Temperature: ${obj.main.temp} °F`;
    dashboardEl.append(cityTemp);

    const cityHumidity = document.createElement('p');
    cityHumidity.textContent = `Humidity: ${obj.main.humidity}%`;
    dashboardEl.append(cityHumidity);

    const cityWindSpeed = document.createElement('p');
    cityWindSpeed.textContent = `Wind Speed: ${obj.wind.speed} MPH`;
    dashboardEl.append(cityWindSpeed);

}

function populate5DayForecast(obj) {
    for (let i = 0; i < 5; i++) {
        let j  = i * 8;
        let k = i + 1;
        console.log(j);
        const dayEl = document.querySelector(`#day-${k}`);
        const cityTemp = document.createElement('p');
        cityTemp.textContent = `Temperature: ${obj.list[j].main.temp} °F`;
        dayEl.append(cityTemp);

        const cityHumidity = document.createElement('p');
        cityHumidity.textContent = `Humidity: ${obj.list[j].main.humidity}%`;
        dayEl.append(cityHumidity);

        const cityWindSpeed = document.createElement('p');
        cityWindSpeed.textContent = `Wind Speed: ${obj.list[j].wind.speed} MPH`;
        dayEl.append(cityWindSpeed);
    }
}