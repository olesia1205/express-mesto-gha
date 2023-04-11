require('dotenv').config();
const http2 = require('node:http2');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');

const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

const app = express();

// const {
//   MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
// } = process.env;

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64356be7bc387c571b1d1829',
//   };
//   next();
// });

app.post('/signin', express.json(), login);
app.post('/signup', express.json(), createUser);
app.use('/', routes);

app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({ message: statusCode === SERVER_ERROR ? 'Произошла ошибка на сервере' : message });
  // res.status(err.statusCode).send({ message: err.message });
});

async function connect() {
  await mongoose.connect(process.env.MONGO_URL, {});
  console.log(`Server connected db ${process.env.MONGO_URL}`);
  await app.listen(process.env.PORT);
  console.log(`Server listen port ${process.env.PORT}`);
}

connect();
