const express = require('express');

const adminrouter = express.Router();
const { register, auth } = require('../controllers/auth');

adminrouter.post('/register', express.json(), register);
adminrouter.post('/auth', express.json(), auth);

module.exports = adminrouter;
