const http2 = require('node:http2');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

const SOLT_ROUNDS = 10;

const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;
const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;
const FORBIDDEN = http2.constants.HTTP_STATUS_FORBIDDEN;
const CONFLICT = http2.constants.HTTP_STATUS_CONFLICT;
const UNAUTHORIZED = http2.constants.HTTP_STATUS_UNAUTHORIZED;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

// module.exports.register = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(BAD_REQUEST).send({ message: 'Не передан email или password' });
//   }

//   try {
//     // const user = await User.findOne({ email });
//     // if (user) {
//     //   return res.status(CONFLICT).send({ message: 'Такой пользователь уже существует' });
//     // }

//     const hash = await bcrypt.hash(password, SOLT_ROUNDS);

//     const newUser = await User.create({ email, password: hash });
//     if (newUser) {
//       return res.status(CREATED).send({ email: newUser.email, _id: newUser._id });
//     }
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       return res.status(BAD_REQUEST).send({ message: 'Не валидная почта или пароль' });
//     }
//     if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
//       return res.status(CONFLICT).send({ message: 'Такой пользователь уже существует' });
//     }
//     return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
//   }
// };

module.exports.auth = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
    }

    const token = generateToken({ _id: user._id, email: user.email });

    return res.status(OK).send({ message: 'Авторизация успешна!', _id: user._id, email: user.email });
  } catch (error) {
    return res.status(SERVER_ERROR).send({ message: 'Не удалось авторизоваться' });
  }
};
