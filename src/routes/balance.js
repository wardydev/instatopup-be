const express = require('express')
const { getUserBalance } = require('../controller/balance.js')
const {
  authenticatedToken,
  checkStatusWebsite,
} = require('../middleware/authenticateToken.js')
const { apiLimiterRestApi } = require('../middleware/customer.js')
const router = express.Router()

router.get(
  '/',
  authenticatedToken,
  apiLimiterRestApi,
  checkStatusWebsite,
  getUserBalance
)

module.exports = router
