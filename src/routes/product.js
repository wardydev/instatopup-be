const express = require('express')
const { getProducts, getVariantBrandKey } = require('../controller/products.js')
const { apiKeyAndIpWhitelistMiddleware } = require('../middleware/customer.js')

const router = express.Router()

router.get('/', apiKeyAndIpWhitelistMiddleware, getProducts)
router.get('/:brand_key', apiKeyAndIpWhitelistMiddleware, getVariantBrandKey)

module.exports = router
