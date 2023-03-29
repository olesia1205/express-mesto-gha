const routes = require('express').Router();
const usersRoutes = require('./users');

routes.use('/users', usersRoutes);

module.exports = routes;
