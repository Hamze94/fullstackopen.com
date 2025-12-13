import axios from 'axios'
import React from 'react'
import contactService from '../services/contact'
const Persons = ({ persons, setPersons }) => {
    const handleDelete = (person) => {
        console.log('Delete id', person.id)
        if (window.confirm(`delete  ${person.name} ?`)) {
            contactService.remove(person.id).then(() => {
                console.log(`Deleted contact with id ${person.id}`)
                setPersons(persons.filter(p => p.id !== person.id))
            })
        }
    }
    return (
        <div>
            {persons.map((person) =>
                <p key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() => handleDelete(person)}>delete</button>
                </p>
            )}
        </div>
    )
}

export default Persons
