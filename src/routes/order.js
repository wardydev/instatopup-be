const express = require('express')
const {
  getDashboardChart,
  createOrder,
  createPayment,
  checkStatusProduct,
  getTransaction,
} = require('../controller/order.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')
const {
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
} = require('../middleware/customer.js')

const router = express.Router()

router.get(
  '/dashboard',
  authenticatedToken,
  apiLimiterRestApi,
  getDashboardChart
)
router.post(
  '/create',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  createOrder
)
router.get(
  '/payment',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  createPayment
)
router.get(
  '/check',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  checkStatusProduct
)
router.get(
  '/',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  getTransaction
)

module.exports = router
