import axios from 'axios'
import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import contactService from './services/contact'
const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    console.log('effect')
    contactService.getAll().then(initialContacts => {
      setPersons(initialContacts)
    })
  }, [])
  const [searchTerm, setSearchTerm] = useState('')
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h2>Add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} />
      <h2>Numbers</h2>
      list of persons
      <Persons persons={filteredPersons} setPersons={setPersons} />
    </div>
  )
}

export default App