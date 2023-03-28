const express = require('express');
const mongoose = require('mongoose');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

const app = express();

mongoose.connect(MONGO_URL, {});

app.get('/', (req, res) => {
  res.send(
    `<html>
    <body>
      <p>Ответ на сигнал из космоса</p>
    </body>
    </html>`,
  );
});

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
