import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';

function kelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentWeatherResponse = await axios.get(
        'http://api.openweathermap.org/data/2.5/weather?lat=43.7&lon=-79.42&appid=f497dae475834f3f8e22b08c9a34130a'
      );
  
      setWeatherData(currentWeatherResponse.data);
  
      const forecastResponse = await axios.get(
        'http://api.openweathermap.org/data/2.5/forecast?lat=43.7&lon=-79.42&appid=f497dae475834f3f8e22b08c9a34130a'
      );
  
      setForecastData(forecastResponse.data);
    };
  
    fetchData();
  }, []);

  const getWeatherIconUrl = (iconCode) => `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const renderCurrentTemperature = () => (
    <div className={`current-temperature ${weatherData.weather[0].main}`}>
      <h2>{weatherData.name}, {weatherData.sys.country}</h2>
      <img src={getWeatherIconUrl(weatherData.weather[0].icon)} alt={weatherData.weather[0].description} />
      <p className="bold-uppercase">{weatherData.weather[0].description}</p>
      <p>Temperature: {kelvinToCelsius(weatherData.main.temp)}°C</p>
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Pressure: {weatherData.main.pressure} hPa</p>
      <p>Wind Direction: {weatherData.wind.deg}°</p>
      <p>Visibility: {weatherData.visibility} meters</p>
      <p>Cloudiness: {weatherData.clouds.all}%</p>
      <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
      <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
    </div>
  );
  

  const filterHighestTemps = (forecastList) => {
    const groupedByDate = forecastList.reduce((acc, item) => {
      const date = new Date(item.dt_txt).toLocaleDateString();
      if (!acc[date] || acc[date] < item.main.temp_max) {
        acc[date] = {
          temp_max: item.main.temp_max,
          icon: item.weather[0].icon,
        };
      }
      return acc;
    }, {});

    return Object.keys(groupedByDate).map((date) => ({
      date,
      ...groupedByDate[date],
    }));
  };

  const filteredForecast = forecastData ? filterHighestTemps(forecastData.list) : [];

  return (
    <div className="weather-container">
      <div className="weather-content">
        {weatherData && renderCurrentTemperature()}
        <div className="forecast">
          <h2>7 Days Forecast</h2>
          <div className="forecast-items">
            {filteredForecast.map((item) => (
              <div className="forecast-item" key={item.date}>
                <p>{new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <img src={getWeatherIconUrl(item.icon)} alt="" />
                <p>{kelvinToCelsius(item.temp_max)}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
