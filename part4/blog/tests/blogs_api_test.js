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
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body[2].likes, 0)
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
        .send(newBlogMissingTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(newBlogMissingUrl)
        .expect(400)
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    console.log(blogsAtStart.body)
    const blogToDelete = blogsAtStart.body[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
    const ids = blogsAtEnd.body.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))
})

after(async () => {
    await mongoose.connection.close()
})

