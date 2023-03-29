const express = require('express');

const router = express.Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', express.json(), createUser);

module.exports = router;
