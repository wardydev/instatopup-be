const express = require('express')
const {
  getHistoryDeposit,
  checkDeposit,
  createDeposit,
  getUserDepositBalance,
} = require('../controller/restapi')
const { authenticatedToken } = require('../middleware/authenticateToken')
const { apiLimiterRestApi } = require('../middleware/customer')
const router = express.Router()

router.get('/', authenticatedToken, apiLimiterRestApi, getHistoryDeposit)
router.get('/check', authenticatedToken, apiLimiterRestApi, checkDeposit)
router.post('/create', authenticatedToken, apiLimiterRestApi, createDeposit)
router.get(
  '/balance',
  authenticatedToken,
  apiLimiterRestApi,
  getUserDepositBalance
)

module.exports = router
