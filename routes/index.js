const routes = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

routes.use('/users', usersRouter);
routes.use('/cards', cardsRouter);

module.exports = routes;
