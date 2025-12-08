import { use, useState } from 'react'
import React from 'react'
import axios from 'axios'
function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const handleChange = (event) => {
    setSearchTerm(event.target.value)
    use(axios.get('https://restcountries.com/v3.1/all')).then((response) => {
      console.log(response.data)
    })
  }
  return (
    <>
      <div>
        find countries
        <input onChange={handleChange} value={searchTerm} />
      </div>
    </>
  )
}

export default App
