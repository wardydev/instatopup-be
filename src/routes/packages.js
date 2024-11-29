const express = require('express')
const { getPackages } = require('../controller/packages.js')
const { apiLimiterRestApi } = require('../middleware/customer.js')

const router = express.Router()

router.get('/', apiLimiterRestApi, getPackages)

module.exports = router
