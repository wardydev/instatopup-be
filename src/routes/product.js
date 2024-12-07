const express = require('express')
const {
  getProducts,
  getVariantBrandKey,
  createUserProductPrice,
  updateUserProductPrice,
  deleteUserProductPrice,
  getVariantBrandKeyUser,
  getUserProducts,
  getLandingProduct,
  getVariantLandingBrandKey,
} = require('../controller/products.js')
const {
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
} = require('../middleware/customer.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')

const router = express.Router()

router.get('/', apiKeyAndIpWhitelistMiddleware, apiLimiterRestApi, getProducts)
router.get('/users', authenticatedToken, apiLimiterRestApi, getUserProducts)
router.get('/landing', apiLimiterRestApi, getLandingProduct)
router.get('/landing/:brand_key', apiLimiterRestApi, getVariantLandingBrandKey)
router.get(
  '/:brand_key',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  getVariantBrandKey
)
router.get(
  '/users/:brand_key',
  authenticatedToken,
  apiLimiterRestApi,
  getVariantBrandKeyUser
)
router.post(
  '/create/:brand_key',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  createUserProductPrice
)
router.patch(
  '/update',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  updateUserProductPrice
)
router.get(
  '/delete',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  deleteUserProductPrice
)

module.exports = router
