const express = require('express')
const { getDashboardChart } = require('../controller/order')

const router = express.Router()

router.get('/dashboard', getDashboardChart)

module.exports = router
