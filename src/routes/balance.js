const express = require('express')
const { getUserBalance } = require('../controller/balance.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')
const router = express.Router()

router.get('/', authenticatedToken, getUserBalance)

module.exports = router
