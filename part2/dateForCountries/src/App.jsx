import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then((response) => {
      setAllCountries(response.data)
    })
  }, [])

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCountries([])
    } else {
      const filter = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCountries(filter)

      if (filter.length === 1 && filter[0].capital && apiKey) {
        const capital = filter[0].capital[0]
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
          .then(response => {
            setWeather(response.data)
          })
          .catch(error => {
            console.log('Weather fetch failed')
            setWeather(null)
          })
      } else {
        setWeather(null)
      }
    }
  }, [searchTerm, allCountries, apiKey])

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleShow = (countryName) => {
    setSearchTerm(countryName)
  }

  return (
    <div>
      <div>
        find countries
        <input onChange={handleChange} value={searchTerm} />
      </div>

      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        <div>
          <div>
            <h1>{filteredCountries[0].name.common}</h1>
            <p>capital {filteredCountries[0].capital}</p>
            <p>area {filteredCountries[0].area}</p>
            <h2>languages:</h2>
            <ul>
              {Object.values(filteredCountries[0].languages).map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
            <img src={filteredCountries[0].flags.png} alt="flag" width="150" />
          </div>

          {weather ? (
            <div>
              <h2>Weather in {filteredCountries[0].capital}</h2>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Weather: {weather.weather[0].description}</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt={weather.weather[0].description}
              />
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          ) : apiKey ? (
            <p>Loading weather...</p>
          ) : (
            <p>Weather data unavailable (API key not configured)</p>
          )}
        </div>
      ) : (
        filteredCountries.map((country) => (
          <p key={country.name.common}>
            {country.name.common}
            <button onClick={() => handleShow(country.name.common)}>Show</button>
          </p>
        ))
      )}
    </div>
  )
}

export default App