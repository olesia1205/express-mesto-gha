require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

const {
  MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: '6424200f18e41c07a03eb9e8',
  };
  next();
});

app.use('/', routes);

async function connect() {
  await mongoose.connect(MONGO_URL, {});
  // console.log(`Server connected db ${process.env.MONGO_URL}`);
  await app.listen(process.env.PORT);
  // console.log(`Server listen port ${process.env.PORT}`);
}

connect();
