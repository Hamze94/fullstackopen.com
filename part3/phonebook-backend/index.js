require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const path = require('path');
const Person = require('./models/person');
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))
const url = process.env.MONGODB_URL
mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })
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
    Person.find({}).then(persons => {
        response.json(persons);
    })
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
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndDelete(id).then(() => {
        response.status(204).end();
    }).catch(error => next(error));
});
app.post('/api/persons', (request, response) => {
    const body = request.body;

    const newPerson = {
        name: body.name,
        number: body.number
    };
    Person.create(newPerson)
        .then(person => {
            response.status(201).json(person);
        })
        .catch(error => {
            response.status(400).json({ error: error.message });
        });
});
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}
app.use(errorHandler)
app.use(express.static(path.join(__dirname, 'dist'),));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});