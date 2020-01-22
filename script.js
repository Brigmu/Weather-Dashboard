const cityInputEl = document.querySelector('#city-input');
const submitBtnEl = document.querySelector('#city-submit');
const dashboardEl = document.querySelector('.city-forecast');


const url = 'https://api.openweathermap.org/data/2.5/forecast?q=';
let city = 'Seattle';
const auth = "&appid=fbe457a4568f0bd33f8aea7d30a321e7"
const dataType = '&units=imperial'
const fullUrl = url + city + auth + dataType;

fetch(fullUrl)
    .then(function(response){
        return response.json();
    })
        .then(function(json){
            console.log(json);
            populateTodaysForecast(json);
        });

function populateTodaysForecast(obj) {
    const cityName = document.createElement('h2');
    cityName.textContent = obj.city.name;
    dashboardEl.append(cityName);
    
    const cityTemp = document.createElement('p');
    cityTemp.textContent = `Temperature: ${obj.list[0].main.temp} °F`;
    dashboardEl.append(cityTemp);

    const cityHumidity = document.createElement('p');
    cityHumidity.textContent = `Humidity: ${obj.list[0].main.humidity}%`;
    dashboardEl.append(cityHumidity);

    const cityWindSpeed = document.createElement('p');
    cityWindSpeed.textContent = `Wind Speed: ${obj.list[0].wind.speed} MPH`;
    dashboardEl.append(cityWindSpeed);

}