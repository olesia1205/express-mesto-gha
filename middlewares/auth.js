const http2 = require('node:http2');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV, JWT_DEV_SECRET } = process.env;
const UNAUTHORIZED = http2.constants.HTTP_STATUS_UNAUTHORIZED;
const FORBIDDEN = http2.constants.HTTP_STATUS_FORBIDDEN;
const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  token = token.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(FORBIDDEN).send({ message: 'Нет доступа' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  }

  req.user = payload;
  next();
};
