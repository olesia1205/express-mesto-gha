const express = require('express');

const router = express.Router();
const {
  getCards, deleteCard, createCard, putLike, deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', express.json(), createCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
