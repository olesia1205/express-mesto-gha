const http2 = require('node:http2');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;
const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;
// const FORBIDDEN = http2.constants.HTTP_STATUS_FORBIDDEN;
const CONFLICT = http2.constants.HTTP_STATUS_CONFLICT;
const UNAUTHORIZED = http2.constants.HTTP_STATUS_UNAUTHORIZED;

const SOLT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new Error('Not found');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидный id пользователя' });
      } else if (err.message === 'Not found') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });
    if (newUser) {
      return res.status(CREATED).send(newUser);
    }
    return (newUser);
  } catch (error) {
    if (!email || !password) {
      return res.status(BAD_REQUEST).send({ message: 'Не передан email или password' });
    }
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Не валидные почта или пароль' });
    }
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      return res.status(CONFLICT).send({ message: 'Такой пользователь уже существует' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.login = async (req, res) => {
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

    const token = generateToken({ _id: user._id });

    return res.status(OK).send(token);
  } catch (error) {
    return res.status(SERVER_ERROR).send({ message: 'Не удалось авторизоваться' });
  }
};

// module.exports.login = (req, res) => {
//   const { email, password } = req.body;

//   User.findOne({ email })
//     .orFail(() => res.status(NOT_FOUND).send({
//        message: 'Пользователь с такими данными не найден'
//      }))
//     .then((user) => {
//       bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (matched) {
//             res.status(OK).send(user);
//           }
//           res.status(FORBIDDEN).send({ message: 'Неверный пароль' });
//         });
//     })
//     .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));
// };

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Произошла ошибка валидации полей' });
      } else if (err.message === 'User not found') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((err) => {
      if (err.message === 'User not found') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};
