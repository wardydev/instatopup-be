const express = require('express')
const {
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
} = require('../middleware/customer.js')
const { getCategories } = require('../controller/category.js')

const router = express.Router()

router.get(
  '/',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  getCategories
)

module.exports = router
