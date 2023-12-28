const openWeatherAPIKey = "4974ac4d803cd7f639c43cfd1f563096";
let cityLatitude, cityLongitude;

//on click of search button,
$("form").on("submit", function (event) {
  //stop default behaviour of form
  event.preventDefault();
  //Get the city name for search
  let city = $("#search-input").val();

  //take search input value, add it to local storage
  localStorage.setItem(`searchItem_${localStorage.length + 1}`, city);
  showPreviousSearches();
  if (!city) {
    alert("Search cannot be empty. Please input the name of a city");
    return;
  }

  fetchCityWeatherForecast(city);
});
// fetch(
//   `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`
// );
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
  console.dir(weatherForecast);
  createForecastItems(weatherForecast.list);
}

function createForecastItems(weatherData) {
  for (let i = 1; i < 6; i++) {
    const row = $("<div>");
    row.addClass("row");
    row.attr("id", `row_${i}`);
    $("#fiveDayForecast").append(row);
  }

  for (let i = 1; i < weatherData.length; i++) {
    const weather = weatherData[i];
    //create forecast element
    const div = $("<div>");
    div.addClass("col flex-column forecastDay text-white pt-3");
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
    let historyItem = $("<button class='btn btn-secondary mb-2'>");
    historyItem.append(localStorage.getItem(`searchItem_${i}`));
    $("#history").append(historyItem);
  }
}

function init() {
  $("#history").empty();
  showPreviousSearches();
}

init();
