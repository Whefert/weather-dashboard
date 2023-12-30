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

  fetchCityWeatherForecast(city);
  showPreviousSearches();
});

async function fetchCityLatAndLong(cityName) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${openWeatherAPIKey}`
  );

  cities = await response.json();
  if (cities.length == 0) {
    return;
  } else {
    return { lat: cities[0].lat, lon: cities[0].lon };
  }
}

async function fetchCityWeatherForecast(cityName) {
  const coordinates = await fetchCityLatAndLong(cityName);
  if (!coordinates) {
    alert("Invalid city, please try again");
    return;
  }
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${openWeatherAPIKey}&units=metric`
  );

  const weatherForecast = await response.json();
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${openWeatherAPIKey}&units=metric`
  );

  let currentWeather = await res.json();
  let currentWeatherObj = {
    name: currentWeather.name,
    time: currentWeather.dt,
    temp: currentWeather.main.temp,
    wind: currentWeather.wind.speed,
    humidity: currentWeather.main.humidity,
    weather: currentWeather.weather[0].main,
  };
  updateCurrentWeather(currentWeatherObj);
  createForecastItems(weatherForecast.list);
  localStorage.setItem(`searchItem_${localStorage.length + 1}`, cityName);
  showPreviousSearches();
}

function updateCurrentWeather(currentWeather) {
  $("#today .city").text(currentWeather.name);
  $("#today .date").text(`(${dayjs().format("DD/MM/YYYY")})`);
  $("#today .time").text(`Time: ${dayjs().format("HH:mm")} (GMT)`);
  $("#today .weather").empty();
  $("#today .weather").append(showWeatherIcon(currentWeather.weather));
  $("#today .temp").text(`${currentWeather.temp} °C`);
  $("#today .wind").text(`${currentWeather.wind} m/s`);
  $("#today .humidity").text(`${currentWeather.humidity}%`);
}

function createForecastItems(weatherData) {
  $("#fiveDayForecast").empty();
  for (let i = 1; i < 6; i++) {
    const row = $(
      `<div class='row my-2 d-flex justify-content-between' id='row_${i}'>`
    );
    $("#fiveDayForecast").append(row);
  }

  for (let i = 0; i < weatherData.length; i++) {
    const weather = weatherData[i];
    //create forecast element
    const div = $(
      "<div class='col col-lg-2 mx-1 mb-2 flex-column forecastDay text-white text-center pt-3'>"
    );
    let day = $("<h5>");
    let date = $("<p>");
    day.text(dayjs.unix(weather.dt).format("dddd"));
    date.text(dayjs.unix(weather.dt).format("DD/MM/YYYY"));
    let time = $("<p>");
    time.text(`Time: ${dayjs.unix(weather.dt).format("HH:mm:")}`);
    let clouds = $(showWeatherIcon(weather.weather[0].main));
    let temp = $("<p>");
    let wind = $("<p>");
    let humidity = $("<p>");
    temp.text(`Temp: ${weather.main.temp} °C`);
    wind.text(`Wind: ${weather.wind.speed} m/s`);
    humidity.text(`Humidity: ${weather.main.humidity}%`);
    div.append(day);
    div.append(date);
    div.append(time);
    div.append(clouds);
    div.append(temp);
    div.append(wind);
    div.append(humidity);

    $("#row_1").append(div);
  }
}

function showPreviousSearches() {
  $("#history").empty();
  for (let i = 1; i < localStorage.length + 1; i++) {
    let city = localStorage.getItem(`searchItem_${i}`);
    let historyItem = $(
      `<button class='btn btn-secondary mb-2 history-item text-capitalize' data-city='${city}'>`
    );
    historyItem.append(city);
    $("#history").append(historyItem);
  }

  $(".history-item").on("click", function (event) {
    city = event.target.dataset.city;
    fetchCityWeatherForecast(city);
  });
}

function init() {
  fetchCityWeatherForecast("London");
  clearHistory();
}

function clearHistory() {
  localStorage.clear();
  showPreviousSearches();
}

$("#clear-search-button").on("click", () => {
  clearHistory();
});

function showWeatherIcon(weather) {
  if (weather === "Rain") {
    return "<i class='bi bi-cloud-rain-heavy'></i>";
  } else if (weather === "Clouds") {
    return "<i class='bi bi-clouds'></i>";
  } else if (weather === "Snow") {
    return "<i class='bi bi-cloud-snow'></i>";
  } else if (weather === "Haze") {
    return "<i class='bi bi-cloud-haze'></i>";
  } else {
    return "<i class='bi bi-sun'></i>";
  }
}

init();
