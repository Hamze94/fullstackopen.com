const bcrypt = require('bcryptjs');
const { test, after, beforeEach, describe, before } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')
const User = require('../models/User')
const helper = require('../utils/test_helper')
const api = supertest(app)

// Connect to database before all tests
before(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // 5 second timeout
    })
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        // Clear all users more efficiently
        await User.deleteMany({}).maxTimeMS(5000) // Set timeout for this operation

        // Create test user
        const passwordHash = await bcrypt.hash('sekret', 10)
        await User.create({
            username: 'root',
            name: 'Superuser',
            passwordHash
        })
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        // Use a more flexible assertion
        assert(result.body.error.toLowerCase().includes('unique'))

        // Verify no new user was created
        const users = await helper.usersInDb()
        assert.strictEqual(users.length, 1) // Should still only have the 'root' user
    })
})

describe('user creation validation', () => {
    beforeEach(async () => {
        await User.deleteMany({}).maxTimeMS(5000)
    })

    test('creation fails with too short username', async () => {
        const newUser = {
            username: 'ab',
            name: 'Short Name',
            password: 'validpassword',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('shorter than the minimum allowed length'))
        assert(result.body.error.includes('username'))
    })

    test('creation fails with too short password', async () => {
        const newUser = {
            username: 'validname',
            name: 'Valid Name',
            password: 'pw',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.error, 'password missing or too short')
    })
})

after(async () => {
    await mongoose.connection.close()
})