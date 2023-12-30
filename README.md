# Weather Dashboard

## Description

A weather dashboard that runs in the browser and features dynamically updated HTML and CSS. The dashboard uses the [5 Day Weather Forecast](https://openweathermap.org/forecast5) API to retrieve weather data for cities. The OpenWeatherMap API is used to retrieve the geographical coordinates for the given city name. User searches are stored in `localStorage` for data persistence.

Here is the link to the deployed application: https://whefert.github.io/weather-dashboard/

See a demo recording of the application below:

![The weather app includes a search option, a list of cities, and a five-day forecast and current weather conditions for searched cities.](./assets/images/weather-app-demo-gif.gif)

## Acceptance Criteria

- Create a weather dashboard with form inputs.
  - When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
  - When a user views the current weather conditions for that city they are presented with:
    - The city name
    - The date
    - An icon representation of weather conditions
    - The temperature
    - The humidity
    - The wind speed
  - When a user views future weather conditions for that city they are presented with a 5-day forecast that displays:
    - The date
    - An icon representation of weather conditions
    - The temperature
    - The humidity
  - When a user clicks on a city in the search history they are again presented with current and future conditions for that city

## Installation

N/A

## Usage

- To find the weather forecast for a given city, simply enter the city name into the search input and click the search button.

## Credits

N/A

## License

Please refer to the LICENSE in the repo.
