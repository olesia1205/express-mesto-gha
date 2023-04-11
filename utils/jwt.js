const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret-key', { expiresIn: '7d' });
