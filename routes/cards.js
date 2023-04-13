const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getCards, deleteCard, createCard, putLike, deleteLike,
} = require('../controllers/cards');

const urlRegExp = /^https?:\/\/(www.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*#?$/;

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'string.empty': 'Поле "name" должно быть заполнено',
      }),
    link: Joi.string().required().pattern(urlRegExp)
      .message('Поле "link" должно быть валидным url-адресом')
      .messages({ 'string.empty': 'Поле "link" должно быть заполнено' }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({ cardId: Joi.string().alphanum().length(24) }),
});

router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCard);
router.post('/', express.json(), validateCreateCard, createCard);
router.put('/:cardId/likes', validateCardId, putLike);
router.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
