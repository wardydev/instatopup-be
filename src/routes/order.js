const express = require('express')
const { getDashboardChart } = require('../controller/order.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')

const router = express.Router()

router.get('/dashboard', authenticatedToken, getDashboardChart)

module.exports = router
