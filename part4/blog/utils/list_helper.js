const _ = require('lodash')
const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
const favoriteBlog = (blogs) => {
    return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav), blogs[0])
}
const mostBlogs = (blogs) => {
    const authorCounts = _.countBy(blogs, 'author')
    const [topAuthor, maxBlogs] = _.chain(authorCounts)
        .toPairs()
        .maxBy(([author, count]) => count)
        .value()
    return { author: topAuthor, blogs: maxBlogs }
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}