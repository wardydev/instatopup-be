const express = require('express')
const { getProducts } = require('../controller/products.js')
const { apiKeyAndIpWhitelistMiddleware } = require('../middleware/customer.js')

const router = express.Router()

router.get('/', apiKeyAndIpWhitelistMiddleware, getProducts)

module.exports = router
