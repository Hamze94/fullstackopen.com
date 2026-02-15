const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')
const Blog = require('../models/Blog')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

const api = supertest(app)

let token = null
let userId = null

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('testpass', 10)
    const user = new User({
        username: 'testuser',
        name: 'Test User',
        passwordHash
    })
    const savedUser = await user.save()
    userId = savedUser._id
    const loginResponse = await api
        .post('/api/login')
        .send({
            username: 'testuser',
            password: 'testpass'
        })
    token = loginResponse.body.token
    const blog1 = new Blog({
        title: 'Test Blog 1',
        author: 'Author One',
        url: 'http://test1.com',
        likes: 5,
        user: savedUser._id
    })

    const blog2 = new Blog({
        title: 'Test Blog 2',
        author: 'Author Two',
        url: 'http://test2.com',
        likes: 10,
        user: savedUser._id
    })

    await blog1.save()
    await blog2.save()
})

test('blog list application returns the correct amount of blog posts in JSON format', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 2)
})

test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    assert('id' in response.body[0])
    assert.strictEqual(typeof response.body[0].id, 'string')
})

test('a valid blog can be added', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const initialCount = blogsAtStart.body.length

    const newBlog = {
        title: 'New Test Blog',
        author: 'New Author',
        url: 'http://newtestblog.com',
        likes: 0
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialCount + 1)
})

test('blog without likes defaults to 0', async () => {
    const newBlog = {
        title: 'Blog Without Likes',
        author: 'New Author',
        url: 'http://newtestblog.com'
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const newBlogResponse = response.body[response.body.length - 1]
    assert.strictEqual(newBlogResponse.likes, 0)
})

test('blog without title or url returns 400', async () => {
    const newBlogMissingTitle = {
        author: 'New Author',
        url: 'http://newtestblog.com',
        likes: 0
    }

    const newBlogMissingUrl = {
        title: 'Blog Without URL',
        author: 'New Author',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogMissingTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogMissingUrl)
        .expect(400)
})

test('adding blog without token returns 401', async () => {
    const newBlog = {
        title: 'No Token Blog',
        author: 'No Author',
        url: 'http://notoken.com',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
    const ids = blogsAtEnd.body.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))
})
test('cannot delete blog with wrong token', async () => {
    const otherPasswordHash = await bcrypt.hash('otherpass', 10)
    const otherUser = new User({
        username: 'otheruser',
        name: 'Other User',
        passwordHash: otherPasswordHash
    })
    await otherUser.save()
    const otherLogin = await api
        .post('/api/login')
        .send({
            username: 'otheruser',
            password: 'otherpass'
        })
    const otherToken = otherLogin.body.token
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403)
})

test('a blog\'s likes can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
    const updatedLikes = blogToUpdate.likes + 1

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: updatedLikes })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes, updatedLikes)
})

after(async () => {
    await mongoose.connection.close()
})