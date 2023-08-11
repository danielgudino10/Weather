document.addEventListener('DOMContentLoaded', () => {
  var searchButton = document.getElementById('searchButton');
  var searchInput = document.getElementById('searchInput');
  var weatherInfo = document.getElementById('weatherInfo');
  var searchedCityData = document.getElementById('searchedCityData');

  // Retrieve searched city from local storage
  var storedCity = localStorage.getItem('searchedCity');
  if (storedCity) {
    getWeather(storedCity);
  }

  searchButton.addEventListener('click', () => {
    var location = searchInput.value;
    getWeather(location);
  });

  // Update weather for each city
  var cities = [
    { name: 'Denver', id: 'city1' },
    { name: 'Austin', id: 'city2' },
    { name: 'Miami', id: 'city3' },
    { name: 'Los Angeles', id: 'city4' },
    { name: 'Detroit', id: 'city5' },
  ];

  cities.forEach(city => {
    getWeather(city.name, city.id);
  });
});

function getWeather(location, cityId) {
  var apiKey = '371b3e9195a29b381b2db9fc97c5024e';
  var [city, state] = location.split(',');
  var capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(); // Capitalize first letter and convert the rest to lowercase
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capitalizedCity},${state}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      return response.json();
    })
    .then(data => {
      var temperatureFahrenheit = Math.round(data.main.temp);
      var weatherDescription = data.weather[0].description;

      if (cityId) {
        var cityElement = document.getElementById(cityId);
        cityElement.querySelector('.temperature').textContent = `${temperatureFahrenheit}°F`;
        cityElement.querySelector('.description').textContent = weatherDescription;
      } else {
        searchedCityData.innerHTML = `
          <h2>${capitalizedCity}</h2>
          <p>${temperatureFahrenheit}°F</p>
          <p>${weatherDescription}</p>
        `;

        var weatherData = `
          <p>Feels like: ${data.main.feels_like}°F</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind speed: ${data.wind.speed} mph</p>
        `;
        weatherInfo.innerHTML = weatherData;

        // Store searched city in local storage
        localStorage.setItem('searchedCity', capitalizedCity);
      }
    })
    .catch(error => {
      console.log('Error:', error);
      weatherInfo.innerHTML = 'Error fetching weather data';
    });
}