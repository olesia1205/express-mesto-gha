const routes = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

routes.use('/users', auth, usersRouter);
routes.use('/cards', auth, cardsRouter);

routes.use('*', (req, res, next) => {
  next(new NotFoundError('По указанному url ничего нет'));
});

module.exports = routes;
