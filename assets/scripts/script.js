const openWeatherAPIKey = "4974ac4d803cd7f639c43cfd1f563096";
let cityLatitude, cityLongitude;

//on click of search button,
$(".search-button").on("click", function (event) {
  //stop default behaviour of form
  event.preventDefault();
  //Get the city name for search
  let city = $("#search-input").val();

  //take search input value, add it to local storage

  if (!city) {
    alert("Search cannot be empty. Please input the name of a city");
    return;
  }
  localStorage.setItem(`searchItem_${localStorage.length + 1}`, city);
  showPreviousSearches();
  fetchCityWeatherForecast(city);
});

async function fetchCityLatAndLong(cityName) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${openWeatherAPIKey}`
  );
  cities = await response.json();
  return { lat: cities[0].lat, lon: cities[0].lon };
}

async function fetchCityWeatherForecast(cityName) {
  const coordinates = await fetchCityLatAndLong(cityName);
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${openWeatherAPIKey}`
  );

  const weatherForecast = await response.json();
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${openWeatherAPIKey}`
  );

  let currentWeather = await res.json();
  console.dir(currentWeather);

  let currentWeatherObj = {
    name: currentWeather.name,
    temp: currentWeather.main.temp,
    wind: currentWeather.wind.speed,
    humidity: currentWeather.main.humidity,
    weather: currentWeather.weather.description,
  };
  updateCurrentWeather(currentWeatherObj);
  // createForecastItems(weatherForecast.list);
}

function updateCurrentWeather(currentWeather) {
  $("#today .city").text(currentWeather.name);
  $("#today .date").text(`(${dayjs().format("DD/MM/YYYY")})`);
  // $("span.clouds").text();
  $("#today .temp").text(currentWeather.temp);
  $("#today .wind").text(currentWeather.wind);
  $("#today .humidity").text(currentWeather.humidity);
}

function createForecastItems(weatherData) {
  $("#fiveDayForecast").empty();
  for (let i = 1; i < 6; i++) {
    const row = $(`<div class='row gx-2 my-2'  id='row_${i}'>`);
    $("#fiveDayForecast").append(row);
  }

  for (let i = 0; i < weatherData.length; i++) {
    const weather = weatherData[i];
    //create forecast element
    const div = $("<div>");
    div.addClass("col mx-2 flex-column forecastDay text-white pt-3");
    date = $("<p>");
    date.text(dayjs.unix(weather.dt).format("DD/MM/YYYY"));
    div.append(date);
    //Add element to Dom
    if (i < 9) {
      $("#row_1").append(div);
    } else if (i < 17) {
      $("#row_2").append(div);
    } else if (i < 25) {
      $("#row_3").append(div);
    } else if (i < 33) {
      $("#row_4").append(div);
    } else {
      $("#row_5").append(div);
    }
  }
}

function showPreviousSearches() {
  for (let i = 1; i < localStorage.length + 1; i++) {
    let city = localStorage.getItem(`searchItem_${i}`);
    let historyItem = $(
      `<button class='btn btn-secondary mb-2 history-item' data-city='${city}'>`
    );
    historyItem.append(city);
    $("#history").append(historyItem);
  }
}

function init() {
  $("#history").empty();
  showPreviousSearches();
}

function clearHistory() {
  localStorage.clear();
  showPreviousSearches();
}

$("#clear-search-button").on("click", () => {
  clearHistory();
});

init();
$(".history-item").on("click", function (event) {
  city = event.target.dataset.city;
  fetchCityWeatherForecast(city);
});
