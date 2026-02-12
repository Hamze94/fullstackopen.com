
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog')
const User = require('../models/User')
const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
};
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    try {
        const body = request.body;
        const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' });
        }
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return response.status(401).json({ error: 'user not found' });
        }
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
            user: user._id
        });
        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();
        const populatedBlog = await Blog.findById(savedBlog._id)
            .populate('user', { username: 1, name: 1 });
        response.status(201).json(populatedBlog);

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return response.status(401).json({ error: 'token invalid' });
        }
        if (error.name === 'TokenExpiredError') {
            return response.status(401).json({ error: 'token expired' });
        }
        console.error(error);
        response.status(500).json({ error: 'something went wrong' });
    }
});
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