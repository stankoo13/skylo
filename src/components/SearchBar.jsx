import { useState, useEffect, useRef, useCallback } from 'react'

function SearchBar({ onSearch, onSearchByCoords }) {
  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)
  const skipFetchRef = useRef(false)

  const API_KEY = 'a39684f9c8821a99a9e4346e0a28d647'

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (city.length < 2) {
    setSuggestions([])
    return
    }
    if (skipFetchRef.current) {
      skipFetchRef.current = false
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`)
        const data = await res.json()
        setSuggestions(data)
        setShowSuggestions(true)
        setActiveIndex(-1)
      } catch (err) {
        setSuggestions([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [city])

  function handleSubmit(e) {
  e.preventDefault()
  if (city.trim() === '') return
  setShowSuggestions(false)
  setSuggestions([])
  setActiveIndex(-1)
  onSearch(city)
}

function handleSelect(suggestion) {
  const cityName = suggestion.local_names?.en || suggestion.name
  skipFetchRef.current = true
  setCity(cityName)
  setShowSuggestions(false)
  setSuggestions([])
  setActiveIndex(-1)
  onSearchByCoords(suggestion.lat, suggestion.lon, cityName)
}

  function handleKeyDown(e) {
  if (!showSuggestions || suggestions.length === 0) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    setActiveIndex(prev => (prev + 1) % suggestions.length)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)
  } else if (e.key === 'Enter' && activeIndex >= 0) {
    e.preventDefault()
    handleSelect(suggestions[activeIndex])
  } else if (e.key === 'Escape') {
    setShowSuggestions(false)
    setActiveIndex(-1)
  }
}

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => setShowSuggestions(false)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((s, i) => (
            <div
              className={`suggestion-item ${i === activeIndex ? 'active' : ''}`}
              key={i}
              onClick={() => handleSelect(s)}
            >
              <span className="suggestion-name">{s.local_names?.en || s.name}</span>
              <span className="suggestion-country">{s.state ? `${s.state}, ` : ''}{s.country}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar