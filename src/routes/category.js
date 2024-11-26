const express = require('express')
const { apiKeyAndIpWhitelistMiddleware } = require('../middleware/customer.js')
const { getCategories } = require('../controller/category.js')

const router = express.Router()

router.get('/', apiKeyAndIpWhitelistMiddleware, getCategories)

module.exports = router
