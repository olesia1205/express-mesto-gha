const express = require('express');

const router = express.Router();
const {
  getUsers, getMe, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUserById);
router.patch('/me', express.json(), updateUser);
router.patch('/me/avatar', express.json(), updateAvatar);

module.exports = router;
