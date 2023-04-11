require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');

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

async function connect() {
  await mongoose.connect(process.env.MONGO_URL, {});
  console.log(`Server connected db ${process.env.MONGO_URL}`);
  await app.listen(process.env.PORT);
  console.log(`Server listen port ${process.env.PORT}`);
}

connect();
