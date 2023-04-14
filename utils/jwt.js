const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV, JWT_DEV_SECRET } = process.env;

module.exports.generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET, { expiresIn: '7d' });
