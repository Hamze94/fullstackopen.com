const jwt = require('jsonwebtoken');
const User = require('../models/User');
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');  // 👈 MOVE code here
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '');
    } else {
        request.token = null;
    }
    next();
};
const userExtractor = async (request, response, next) => {
    try {
        const token = request.token;
        if (!token) {
            return response.status(401).json({ error: 'token missing' });
        }
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' });
        }
        const user = await User.findById(decodedToken.id);
        request.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { tokenExtractor, userExtractor };