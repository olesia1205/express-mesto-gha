require('dotenv').config();
const http2 = require('node:http2');
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');

const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

const app = express();

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required().alphanum(),
  }),
}), login);

app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);
app.use('/', routes);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({ message: statusCode === SERVER_ERROR ? 'Произошла ошибка на сервере' : message });
  next();
});

async function connect() {
  await mongoose.connect(process.env.MONGO_URL, {});
  // console.log(`Server connected db ${process.env.MONGO_URL}`);
  await app.listen(process.env.PORT);
  // console.log(`Server listen port ${process.env.PORT}`);
}

connect();
