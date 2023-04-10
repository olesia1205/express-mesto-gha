const routes = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
// const adminRouter = require('./admin');

// routes.use('/', adminRouter);
// routes.use('/users', auth, usersRouter);
routes.use('/users', usersRouter);
routes.use('/cards', cardsRouter);

routes.use('*', (req, res) => {
  res.status(404).send({ message: 'По указанному url ничего нет' });
});

module.exports = routes;
