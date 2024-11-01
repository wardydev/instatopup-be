const express = require('express')
const { getDashboardChart, createOrder } = require('../controller/order.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')
const { apiKeyAndIpWhitelistMiddleware } = require('../middleware/customer.js')

const router = express.Router()

router.get('/dashboard', authenticatedToken, getDashboardChart)
router.post('/create', apiKeyAndIpWhitelistMiddleware, createOrder)

module.exports = router
