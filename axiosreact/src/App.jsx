import React, { useState, useEffect} from 'react';
import axios from 'axios';
import './index.css';

function WeatherApp() {
  const [currentLocation, setCurrentLocation] = useState('');
  const [temperature, setTemperature] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    // Get current location
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Delhi,India&appid=8a7815bc24c51c57ebc0036efe5ab14d&uniits=metric`)
       .then(response => {
          const data = response.data;
          setCurrentLocation(data.name);
          setTemperature(`${Math.round(data.main.temp - 273.15)}°C`);
          setDate(new Date(data.dt * 1000).toLocaleDateString());
          setTime(new Date(data.dt * 1000).toLocaleTimeString());
        })
       .catch(error => {
          console.error(error);
          alert('Error getting current location');
        });
    });
  }, []);

  const handleAddLocation = (location) => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Berlin,Germany&appid=8a7815bc24c51c57ebc0036efe5ab14d`)
     .then(response => {
        const data = response.data;
        setLocations([...locations, data.name]);
        setWeatherData({...weatherData, [data.name]: data });
      })
     .catch(error => {
        console.error(error);
        alert('Error adding location');
      });
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`weather-app ${darkMode? 'dark-mode' : ''}`}>
      <header>
        <h1>Weather App</h1>
        <button onClick={handleToggleDarkMode}>Toggle Dark Mode</button>
      </header>
      <main>
        <section>
          <h2>Current Location</h2>
          <p>{currentLocation}</p>
          <p>{temperature}</p>
          <p>{date} {time}</p>
        </section>
        <section>
          <h2>Multiple Locations</h2>
          <ul>
            {locations.map((location, index) => (
              <li key={index}>
                <p>{location}</p>
                <p>Temperature: {weatherData[location].main.temp}°C</p>
                <p>Humidity: {weatherData[location].main.humidity}%</p>
                <p>Wind Speed: {weatherData[location].wind.speed} m/s</p>
                <p>Weather Description: {weatherData[location].weather[0].description}</p>
              </li>
            ))}
          </ul>
          <input type="text" placeholder="Enter location" />
          <button onClick={() => handleAddLocation(document.querySelector('input').value)}>click</button>
        </section>
      </main>
    </div>
  );
}

export default WeatherApp;