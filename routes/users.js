const route = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

route.get('/', getUsers);
route.get('/:userId', getUserById);
route.post('/', createUser);

module.exports = route;
