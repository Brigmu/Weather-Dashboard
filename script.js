const cityInputEl = document.querySelector('#city-input');
const submitBtnEl = document.querySelector('#city-submit');
const dashboardEl = document.querySelector('.city-forecast');
const savedCitiesEl = document.querySelector('.saved-cities');
const clearEl = document.querySelector('#clear-btn');

const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
const uvIndexUrl = 'http://api.openweathermap.org/data/2.5/uvi?'
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
    if (cityInputEl.value != '') {
        let userCityName = cityInputEl.value.trim();
        const fullWeatherUrl = weatherUrl + userCityName + auth + dataType;
        const fullForecastUrl = forecastUrl + userCityName + auth + dataType;

        let check = checkIfUsed(citiesArr, userCityName);
        if (!check) {
            citiesArr.push(userCityName);
        }

        window.localStorage.setItem('cities', JSON.stringify(citiesArr));

        getWeatherData(fullWeatherUrl, fullForecastUrl);
        renderCities();
    }
})

clearEl.addEventListener('click', function(){
    citiesArr = [];
    window.localStorage.removeItem('cities');
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
    addCityListeners();
}


function populateTodaysForecast(obj) {
    dashboardEl.innerHTML = '';
    
    const cityName = document.createElement('h1');
    cityName.textContent = obj.name;
    dashboardEl.append(cityName);

    const todaysDate = document.createElement('h2');
    todaysDate.textContent = moment().format('l');
    dashboardEl.append(todaysDate);
    
    const cityTemp = document.createElement('p');
    cityTemp.textContent = `Temperature: ${obj.main.temp} °F`;
    dashboardEl.append(cityTemp);

    const cityHumidity = document.createElement('p');
    cityHumidity.textContent = `Humidity: ${obj.main.humidity}%`;
    dashboardEl.append(cityHumidity);

    const cityWindSpeed = document.createElement('p');
    cityWindSpeed.textContent = `Wind Speed: ${obj.wind.speed} MPH`;
    dashboardEl.append(cityWindSpeed);

    const lon = obj.coord.lon;
    const lat = obj.coord.lat;
    getUVIndex(lon, lat);

}

function populate5DayForecast(obj) {
    for (let i = 0; i < 5; i++) {
        let j  = i * 8;
        let k = i + 1;
        console.log(j);
        const dayEl = document.querySelector(`#day-${k}`);
        dayEl.innerHTML = '';

        const nextDate = document.createElement('h4');
        nextDate.textContent = moment().add(k, 'days').format('l');
        dayEl.append(nextDate);

        const cityTemp = document.createElement('p');
        cityTemp.textContent = `Temperature: ${obj.list[j].main.temp} °F`;
        dayEl.append(cityTemp);

        const cityHumidity = document.createElement('p');
        cityHumidity.textContent = `Humidity: ${obj.list[j].main.humidity}%`;
        dayEl.append(cityHumidity);

        // const cityWindSpeed = document.createElement('p');
        // cityWindSpeed.textContent = `Wind Speed: ${obj.list[j].wind.speed} MPH`;
        // dayEl.append(cityWindSpeed);
    }
}

function addCityListeners() {
    const citiesEl = document.querySelectorAll('.city');
    for (let i = 0; i < citiesEl.length; i++) {
        citiesEl[i].addEventListener('click', function(){
            let cityName = this.textContent;
            const fullWeatherUrl = weatherUrl + cityName + auth + dataType;
            const fullForecastUrl = forecastUrl + cityName + auth + dataType;
            getWeatherData(fullWeatherUrl, fullForecastUrl);
        })
    }
}

function getUVIndex(lon, lat) {
    const fullUVIndexUrl = `${uvIndexUrl}lat=${lat}&lon=${lon}${auth}`;
    fetch(fullUVIndexUrl)
        .then(function(response){
            return response.json();
        })
            .then(function(json){
                console.log(json);
                const uvIndex = document.createElement('p');
                uvIndex.textContent = `UV Index: ${json.value}`;
                dashboardEl.append(uvIndex);
            });
}

function checkIfUsed(arr, cityCheck) {
    let used = false;
    for (let i = 0; i < arr.length; i++) {
        let arrCity = arr[i];
        if (arrCity == cityCheck) {
            used = true;
        }
    }
    return used;
}