const express = require('express')
const {
  getListWithdrawalUser,
  createRequestWithdrawal,
} = require('../controller/withdrawal')
const {
  authenticatedToken,
  checkStatusWebsite,
} = require('../middleware/authenticateToken')
const router = express.Router()

router.get('/', authenticatedToken, checkStatusWebsite, getListWithdrawalUser)
router.post('/request', authenticatedToken, createRequestWithdrawal)

module.exports = router
