const express = require('express')
const {
  getUserBank,
  createUserBank,
  updateUserBank,
  deleteUserBank,
} = require('../controller/bank.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')
const { apiLimiterRestApi } = require('../middleware/customer.js')
const router = express.Router()

router.get('/', authenticatedToken, apiLimiterRestApi, getUserBank)
router.post('/', authenticatedToken, apiLimiterRestApi, createUserBank)
router.patch('/:bankId', authenticatedToken, apiLimiterRestApi, updateUserBank)
router.delete('/:bankId', authenticatedToken, apiLimiterRestApi, deleteUserBank)

module.exports = router
