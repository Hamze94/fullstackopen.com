const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router()
const User = require('../models/User')
usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    if (!password || password.length < 3) {
        return response.status(400).json({ error: 'password missing or too short' })
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({
        username,
        name,
        passwordHash,
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.code === 11000) {
        return response.status(400).json({
            error: 'username must be unique'
        })
    }
    console.error(error)
    response.status(500).json({ error: 'something went wrong' })
})
usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

module.exports = usersRouter