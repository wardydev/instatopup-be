const express = require('express')
const { authenticatedToken } = require('../middleware/authenticateToken.js')
const {
  createUserProductPrice,
  updateUserProductPrice,
  resetUserProductPrice,
  hideUserProduct,
  showUserProduct,
} = require('../controller/userProduct.js')
const { apiLimiterRestApi } = require('../middleware/customer.js')
const router = express.Router()

router.post(
  '/item/:brand_key',
  apiLimiterRestApi,
  authenticatedToken,
  createUserProductPrice
)
router.patch(
  '/item/:brand_key/:itemKey',
  apiLimiterRestApi,
  authenticatedToken,
  updateUserProductPrice
)
router.delete(
  '/item/:itemKey',
  apiLimiterRestApi,
  authenticatedToken,
  resetUserProductPrice
)
router.post('/hide', apiLimiterRestApi, authenticatedToken, hideUserProduct)
router.delete(
  '/show/:productId/:brandKey',
  apiLimiterRestApi,
  authenticatedToken,
  showUserProduct
)

module.exports = router
