
const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    try {
        const user = await User.findOne({})
        if (!user) {
            return response.status(400).json({
                error: 'No users found. Create a user first.'
            })
        }
        const blog = new Blog({
            ...request.body,
            user: user._id
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        const populatedBlog = await Blog.findById(savedBlog._id)
            .populate('user', { username: 1, name: 1 })

        response.status(201).json(populatedBlog)
    } catch (error) {
        console.error(error)
        response.status(400).json({ error: 'Bad Request' })
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        response.status(400).json({ error: 'Bad Request' })
    }
})
blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body
    const updatedBlog = await Blog.findById(request.params.id)
    if (!updatedBlog) {
        return response.status(404).json({ error: 'Blog not found' })
    }
    try {
        updatedBlog.likes = likes
        const savedBlog = await updatedBlog.save()
        response.json(savedBlog)
    } catch (error) {
        response.status(400).json({ error: 'Bad Request' })
    }


})
module.exports = blogsRouter