const express = require('express');

const router = express.Router();
const { getCards, deleteCard, createCard } = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', express.json(), createCard);

module.exports = router;
