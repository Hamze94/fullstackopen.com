const express = require('express');
const app = express();
const port = 3001;

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
app.get('/info', (request, response) => {
    const timeNow = new Date();
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${timeNow}</p>
        </div>
    `);
});
app.get('/api/persons', (request, response) => {
    console.log(`Request received at: ${timeNow}`);
    response.json(persons);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});