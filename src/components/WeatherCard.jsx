import { WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloud, WiCloudy, WiDayShowers, WiRain, WiThunderstorm, WiSnow, WiFog } from 'react-icons/wi'

function getWeatherIcon(icon, size) {
  const code = icon.slice(0, 2)
  const isNight = icon.endsWith('n')
  const props = { style: { fontSize: size || '64px' } }

  switch(code) {
    case '01': return isNight ? <WiNightClear {...props} /> : <WiDaySunny {...props} />
    case '02': return isNight ? <WiNightAltCloudy {...props} /> : <WiDayCloudy {...props} />
    case '03': return <WiCloud {...props} />
    case '04': return <WiCloudy {...props} />
    case '09': return <WiDayShowers {...props} />
    case '10': return <WiRain {...props} />
    case '11': return <WiThunderstorm {...props} />
    case '13': return <WiSnow {...props} />
    case '50': return <WiFog {...props} />
    default: return <WiDaySunny {...props} />
  }
}

function getHourlyForecast(forecast) {
  return forecast.list.slice(0, 8)
}

function getDailyForecast(forecast) {
  const daily = []
  const seen = new Set()
  forecast.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0]
    if (!seen.has(date)) {
      seen.add(date)
      daily.push(item)
    }
  })
  return daily.slice(0, 7)
}

function formatHour(dt_txt) {
  const date = new Date(dt_txt)
  return date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatDay(dt_txt) {
  const date = new Date(dt_txt)
  return date.toLocaleDateString('en', { weekday: 'short', month: 'numeric', day: 'numeric' })
}

function WeatherCard({ data, forecast, unit }) {
  const isMetric = unit === 'metric'
  const tempUnit = isMetric ? '°C' : '°F'
  const hourly = forecast ? getHourlyForecast(forecast) : []
  const daily = forecast ? getDailyForecast(forecast) : []

  return (
    <div className="dashboard">

      <div className="dashboard-top">
        <div className="main-info">
          <div className="city-row">
            <h1 className="city-name">{data.name}, {data.sys.country}</h1>
            <p className="date">{new Date().toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="description">{data.weather[0].description}</p>
          </div>
          <div className="temp-row">
            <div className="main-icon">{getWeatherIcon(data.weather[0].icon, '120px')}</div>
            <div className="temp-display">
              <h2 className="main-temp">{Math.round(data.main.temp)}{tempUnit}</h2>
              <p className="high-low">H {Math.round(data.main.temp_max)}° / L {Math.round(data.main.temp_min)}°</p>
            </div>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <p className="detail-label">Feels Like</p>
            <p className="detail-value">{Math.round(data.main.feels_like)}{tempUnit}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Wind</p>
            <p className="detail-value">{data.wind.speed} m/s</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Humidity</p>
            <p className="detail-value">{data.main.humidity}%</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Pressure</p>
            <p className="detail-value">{data.main.pressure} hPa</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Visibility</p>
            <p className="detail-value">{(data.visibility / 1000).toFixed(1)} km</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Clouds</p>
            <p className="detail-value">{data.clouds.all}%</p>
          </div>
        </div>
      </div>

      <div className="hourly-section">
        <p className="section-title">Hourly Forecast</p>
        <div className="hourly-scroll">
          {hourly.map((item, i) => (
            <div className="hourly-item" key={i}>
              <p className="hourly-time">{i === 0 ? 'Now' : formatHour(item.dt_txt)}</p>
              <div className="hourly-icon">{getWeatherIcon(item.weather[0].icon, '32px')}</div>
              <p className="hourly-temp">{Math.round(item.main.temp)}{tempUnit}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="daily-section">
        <p className="section-title">7-Day Forecast</p>
        <div className="daily-list">
          {daily.map((item, i) => (
            <div className="daily-item" key={i}>
              <p className="daily-day">{i === 0 ? 'Today' : formatDay(item.dt_txt)}</p>
              <div className="daily-icon">{getWeatherIcon(item.weather[0].icon, '28px')}</div>
              <p className="daily-desc">{item.weather[0].description}</p>
              <p className="daily-temp">{Math.round(item.main.temp_max)}{tempUnit} / {Math.round(item.main.temp_min)}{tempUnit}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default WeatherCard