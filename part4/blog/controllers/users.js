const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router()
const User = require('../models/User')
usersRouter.post('/', async (request, response) => {
    console.log(request.body);
    const { username, name, password } = request.body
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({
        username,
        name,
        passwordHash,
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
});
usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter