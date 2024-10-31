const express = require('express')
const {
  getListWithdrawalUser,
  createRequestWithdrawal,
} = require('../controller/withdrawal')
const { authenticatedToken } = require('../middleware/authenticateToken')
const router = express.Router()

router.get('/', authenticatedToken, getListWithdrawalUser)
router.post('/request', authenticatedToken, createRequestWithdrawal)

module.exports = router
