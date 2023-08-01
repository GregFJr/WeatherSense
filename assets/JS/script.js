// Weather Dashboard
let APIKey = '88eb50293c8c5c644a6ada876a8ef28e';
let city = 'New York';

let forecast = document.getElementById('forecast');
let temp = document.getElementById('temp');
let wind = document.getElementById('wind');
let title = document.getElementById('title');
let cardImg = document.getElementById('card-img');
let searchInput = document.getElementById('search-input');
let searchBtn = document.getElementById('searchBtn');
let searchHistory = document.getElementById('search-history');

let storedCities = JSON.parse(localStorage.getItem('cities')) || [];

const searchCity = (event) => {
  event.preventDefault();
  if (searchInput.value) {
    city = searchInput.value;
    getCityWeather(city);
    getFiveDayForecast(city);
    storedCities.push(city);
    localStorage.setItem('cities', JSON.stringify(storedCities));
    renderSearchHistory();
  }
};

const getCityWeather = (city) => {
  let req = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

  fetch(req)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      title.textContent = data.name;
      forecast.textContent = 'Forecast: ' + data.weather[0].description;
      forecast.setAttribute('style', 'text-transform: capitalize;');
      temp.textContent = 'Temp: ' + Math.round(data.main.temp * 9 / 5 - 459.67) + '°F';
      cardImg.setAttribute('src', `https://source.unsplash.com/800x400/?${city}`);
      cardImg.setAttribute('alt', data.weather[0].description);
      wind.textContent = 'Wind Speed: ' + data.wind.speed + ' m/s';
    });
};

const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayOfWeek[day];
};

const getFiveDayForecast = (city) => {
  let req = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;

  fetch(req)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const forecastCards = document.getElementById('forecastCards');
      forecastCards.innerHTML = ''; // Clear existing cards

      for (let i = 0; i < 5; i++) {
        const date = getDayOfWeek(data.list[i * 8].dt_txt);
        const forecast = 'Forecast: ' + data.list[i * 8].weather[0].description;
        const temp = 'Temp: ' + Math.round(data.list[i * 8].main.temp * 9 / 5 - 459.67) + '°F';
        const wind = 'Wind Speed: ' + data.list[i * 8].wind.speed + ' m/s';

        const card = createForecastCard(date, forecast, temp, wind);
        forecastCards.appendChild(card);
      }
    });
};

const createForecastCard = (date, forecast, temp, wind) => {
  const card = document.createElement('div');
  card.classList.add('col-md-2', 'forecast-card', 'card');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardDate = document.createElement('h5');
  cardDate.classList.add('card-title');
  cardDate.textContent = date;

  const cardForecast = document.createElement('p');
  cardForecast.classList.add('card-text');
  cardForecast.textContent = forecast;

  const cardTemp = document.createElement('p');
  cardTemp.classList.add('card-text');
  cardTemp.textContent = temp;

  const cardWind = document.createElement('p');
  cardWind.classList.add('card-text');
  cardWind.textContent = wind;

  cardBody.appendChild(cardDate);
  cardBody.appendChild(cardForecast);
  cardBody.appendChild(cardTemp);
  cardBody.appendChild(cardWind);
  card.appendChild(cardBody);

  return card;
};

// Render search history
const renderSearchHistory = () => {
  searchHistory.innerHTML = ''; // Clear existing list
  storedCities.forEach((city) => {
    const li = document.createElement('li');
    li.textContent = city;
    li.classList.add('list-group-item');
    li.addEventListener('click', () => {
      searchInput.value = city;
      searchCity(event);
    });

    searchHistory.appendChild(li);
  });
};

// Load search history on page load
renderSearchHistory();

// Event listener for search form submission
searchBtn.addEventListener('click', searchCity);

// Get the initial weather data for the default city
getCityWeather(city);

// Get the 5-day forecast for the default city
getFiveDayForecast(city);

