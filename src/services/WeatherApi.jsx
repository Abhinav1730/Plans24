// services/WeatherApi.js
import axios from "axios";

const OPEN_WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;  // <-- add your API key here

export async function getWeatherForecast(lat, lon, date) {
  try {
    // Get the Unix timestamp for the requested date at midnight UTC
    const targetDate = new Date(date);
    const targetTimestamp = Math.floor(targetDate.setHours(0, 0, 0, 0) / 1000);

    // Fetch One Call data (current + minutely + hourly + daily)
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,current,daily,alerts&appid=${OPEN_WEATHER_API_KEY}&units=metric`;

    const response = await axios.get(url);
    const hourlyData = response.data.hourly;

    // Filter hourly data for the specific date (from midnight to next midnight)
    const filteredHourly = hourlyData.filter(hour => {
      // hour.dt is Unix timestamp in seconds
      return hour.dt >= targetTimestamp && hour.dt < targetTimestamp + 86400;
    }).map(hour => ({
      time: new Date(hour.dt * 1000).toISOString().substr(11, 5), // "HH:MM"
      temp: Math.round(hour.temp),
      description: hour.weather[0].description,
      icon: hour.weather[0].icon,
      windSpeed: hour.wind_speed,
      humidity: hour.humidity,
    }));

    return { hourly: filteredHourly };
  } catch (error) {
    console.error("Weather API error:", error);
    throw new Error("Failed to fetch weather data");
  }
}
