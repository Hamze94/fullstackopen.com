const express = require('express');
const app = express();
const port = 3001;
app.use(express.json());
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
    response.json(persons);
});
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});
app.post('/api/persons', (request, response) => {
    const body = request.body;
    console.log(body)
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number is missing' });
    }
    const nameExists = persons.find(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ error: 'name must be unique' });
    }
    const newPerson = {
        id: (Math.floor(Math.random() * 10000)).toString(),
        name: body.name,
        number: body.number
    };
    persons = persons.concat(newPerson);
    response.status(201).json(newPerson);
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});