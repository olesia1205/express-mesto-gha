const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getUsers, getMe, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "about" - 2',
      'string.max': 'Максимальная длина поля "about" - 30',
    }),
  }),
});

const urlRegExp = /^https?:\/\/(www.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*#?$/;

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegExp)
      .message('Поле "avatar" должно быть валидным url-адресом')
      .messages({ 'string.empty': 'Поле "link" должно быть заполнено' }),
  }),
});

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate({ params: Joi.object().keys({ userId: Joi.string().alphanum().length(24) }) }), getUserById);
router.patch('/me', express.json(), validateUpdateUser, updateUser);
router.patch('/me/avatar', express.json(), validateUpdateAvatar, updateAvatar);

module.exports = router;
