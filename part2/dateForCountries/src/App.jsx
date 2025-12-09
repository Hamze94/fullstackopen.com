import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then((response) => {
      console.log(response.data)
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
    }
  }, [searchTerm, allCountries]);
  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }
  const handleShow = (countryName) => {
    setSearchTerm(countryName)
  }
  return (
    <>
      <div>
        find countries
        <input onChange={handleChange} value={searchTerm} />
        {
          (filteredCountries.length > 10) ? (
            <p>Too many matches, specify another filter</p>
          ) : (filteredCountries.length === 1) ? (
            <div>
              <h1>{filteredCountries[0].name.common}</h1>
              <p>capital {filteredCountries[0].capital}</p>
              <p>area {filteredCountries[0].area}</p>
              <h2>languages:</h2>
              <ul>
                {
                  Object.values(filteredCountries[0].languages).map((language) => (
                    <li key={language}>{language}</li>
                  ))
                }
              </ul>
              <img src={filteredCountries[0].flags.png} alt="flag" width="150" />
            </div>
          ) : (
            filteredCountries.map((country) => (
              <p key={country.name.common}>
                {country.name.common}
                <button onClick={() => handleShow(country.name.common)} >Show</button>
              </p>
            ))
          )
        }

      </div>
    </>
  )
}

export default App
