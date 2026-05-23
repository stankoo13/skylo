import { useState, useEffect, useRef } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import Loading from './components/Loading'
import WeatherBackground from './components/WeatherBackground'


function App() {
  const [forecast, setForecast] = useState(null)
  const [weather, setWeather] = useState(null)
  const [lastCity, setLastCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState('metric')
  const [theme, setTheme] = useState('dark')
  const [popularWeather, setPopularWeather] = useState([])

  const weatherCodeRef = useRef(null)

  const API_KEY = 'a39684f9c8821a99a9e4346e0a28d647'

  async function handleSearch(city, customUnit) {
    const activeUnit = customUnit || unit
    setLoading(true)
    setError(null)
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${activeUnit}&lang=en`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${activeUnit}&lang=en`)
      ])
      const weatherData = await weatherRes.json()
      const forecastData = await forecastRes.json()
      if (weatherData.cod !== 200) {
        setError('City not found!')
        setWeather(null)
        setForecast(null)
      } else {
        setWeather(weatherData)
        weatherCodeRef.current = weatherData.weather[0].id
        setForecast(forecastData)
        setLastCity(city)
        localStorage.setItem('lastCity', city)
      }
    } catch (err) {
      setError('Connection error!')
    } finally {
      setLoading(false)
    }
  }

  async function handleSearchByCoords(lat, lon, cityName, customUnit) {
    const activeUnit = customUnit || unit
    setLoading(true)
    setError(null)
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${activeUnit}&lang=en`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${activeUnit}&lang=en`)
      ])
      const weatherData = await weatherRes.json()
      const forecastData = await forecastRes.json()
      setWeather(weatherData)
      weatherCodeRef.current = weatherData.weather[0].id
      setForecast(forecastData)
      setLastCity(cityName)
      localStorage.setItem('lastCity', cityName)
    } catch (err) {
      setError('Connection error!')
    } finally {
      setLoading(false)
    }
  }

function toggleUnit() {
  const newUnit = unit === 'metric' ? 'imperial' : 'metric'
  setUnit(newUnit)
  if (lastCity) handleSearch(lastCity, newUnit)
  if (popularWeather.length > 0) {
    const cities = ['London', 'Paris', 'New York', 'Beijing', 'Moscow']
    Promise.all(
      cities.map(city =>
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${newUnit}&lang=en`)
          .then(res => res.json())
      )
    ).then(data => setPopularWeather(data))
  }
}

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  useEffect(() => {
  document.body.style.background = theme === 'dark'
    ? 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
    : 'linear-gradient(135deg, #e0eafc, #cfdef3)'
  }, [theme])

  useEffect(() => {
    const cities = ['London', 'Paris', 'New York', 'Beijing', 'Moscow']
    Promise.all(
      cities.map(city =>
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}&lang=en`)
          .then(res => res.json())
      )
    ).then(data => setPopularWeather(data))
  }, [unit])

  return (
    <div className={`app ${theme}`}>
      <WeatherBackground weatherCode={weatherCodeRef.current} theme={theme} />
      <div className="app-header">
        <img
          src="/logo_skylo.png"
          alt="Skylo"
          className="logo"
          onClick={() => { setWeather(null); setForecast(null); setError(null); }}
          style={{ cursor: 'pointer' }}
        />
        <div className="controls">
          <button className="theme-toggle" onClick={toggleTheme}>
            <div className="toggle-track">
              <span className="toggle-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
              <div className="toggle-thumb"></div>
            </div>
          </button>
          <button className="unit-toggle" onClick={toggleUnit}>
            {unit === 'metric' ? '°C / °F' : '°F / °C'}
          </button>
        </div>
      </div>
      <SearchBar onSearch={handleSearch} onSearchByCoords={handleSearchByCoords} lastCity={lastCity} />
      {!weather && !loading && (
        <div className="default-cities">
          <p className="popular-title">Popular Cities</p>
          <div className="default-cities-grid">
            {popularWeather.map((city, i) => (
              <div key={i} className="default-city-btn" onClick={() => handleSearch(city.name)}>
                <p className="default-city-name">{city.name}</p>
                <p className="default-city-temp">{Math.round(city.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
                <p className="default-city-desc">{city.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {loading && <Loading />}
      {error && (
        <div className="error">
          <p>⚠️ {error}</p>
        </div>
      )}
      {weather && <WeatherCard data={weather} forecast={forecast} unit={unit} />}
    </div>
  )
}

export default App