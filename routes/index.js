const routes = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');

routes.use('/users', auth, usersRouter);
routes.use('/cards', auth, cardsRouter);

routes.use('*', (req, res) => {
  res.status(404).send({ message: 'По указанному url ничего нет' });
});

module.exports = routes;
