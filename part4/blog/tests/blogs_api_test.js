const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/Blog')
const assert = require('assert')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blog1 = new Blog({
        title: 'Test Blog 1',
        author: 'Author One',
        url: 'http://test1.com',
        likes: 5
    })

    const blog2 = new Blog({
        title: 'Test Blog 2',
        author: 'Author Two',
        url: 'http://test2.com',
        likes: 10
    })

    await blog1.save()
    await blog2.save()
})
test.only('blog list application returns the correct amount of blog posts in JSON format', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 2)

})

after(async () => {
    await mongoose.connection.close()
})