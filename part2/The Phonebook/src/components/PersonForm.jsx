import axios from 'axios'
import React, { useState } from 'react'
import contactService from '../services/contact'

const PersonForm = ({ persons, setPersons }) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const handleSubmit = (event) => {
        event.preventDefault()
        const isDuplicate = persons.some(person => person.name === newName)
        if (isDuplicate) {
            alert(`${newName} is already added to phonebook`)
            return
        }
        const personObject = { name: newName, number: newNumber }
        contactService.create(personObject).then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
        })

    }
    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }
    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    name: <input value={newName} onChange={handleNameChange} />
                </div>
                <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
                <div>
                    <button onClick={handleSubmit} type="submit">add</button>
                </div>
            </form>

        </>
    )
}

export default PersonForm
