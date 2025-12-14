import axios from 'axios'
import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import contactService from './services/contact'
import Notification from './components/Notification'
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
  const [notification, setNotification] = useState({ message: null, type: '' })
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: '' })
    }, 5000)
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h2>Add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} showNotification={showNotification} />
      <h2>Numbers</h2>
      list of persons
      <Persons persons={filteredPersons} setPersons={setPersons} />
    </div>
  )
}

export default App