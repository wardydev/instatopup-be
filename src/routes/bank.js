const express = require('express')
const {
  getUserBank,
  createUserBank,
  updateUserBank,
  deleteUserBank,
} = require('../controller/bank.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')
const router = express.Router()

router.get('/', authenticatedToken, getUserBank)
router.post('/', authenticatedToken, createUserBank)
router.patch('/:bankId', authenticatedToken, updateUserBank)
router.delete('/:bankId', authenticatedToken, deleteUserBank)

module.exports = router
