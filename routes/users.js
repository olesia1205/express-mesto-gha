const express = require('express');

const router = express.Router();
const {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', express.json(), createUser);
router.patch('/me', express.json(), updateUser);
router.patch('/me/avatar', express.json(), updateAvatar);

module.exports = router;
