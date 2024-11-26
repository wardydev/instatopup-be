const express = require('express')
const {
  getDashboardChart,
  createOrder,
  createPayment,
  checkStatusProduct,
  getTransaction,
} = require('../controller/order.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')
const { apiKeyAndIpWhitelistMiddleware } = require('../middleware/customer.js')

const router = express.Router()

router.get('/dashboard', authenticatedToken, getDashboardChart)
router.post('/create', apiKeyAndIpWhitelistMiddleware, createOrder)
router.get('/payment', apiKeyAndIpWhitelistMiddleware, createPayment)
router.get('/check', apiKeyAndIpWhitelistMiddleware, checkStatusProduct)
router.get('/', apiKeyAndIpWhitelistMiddleware, getTransaction)

module.exports = router
