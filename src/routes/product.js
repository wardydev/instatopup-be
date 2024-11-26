const express = require('express')
const {
  getProducts,
  getVariantBrandKey,
  createUserProductPrice,
  updateUserProductPrice,
  deleteUserProductPrice,
  getVariantBrandKeyUser,
  getUserProducts,
} = require('../controller/products.js')
const { apiKeyAndIpWhitelistMiddleware } = require('../middleware/customer.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')

const router = express.Router()

router.get('/', apiKeyAndIpWhitelistMiddleware, getProducts)
router.get('/users', authenticatedToken, getUserProducts)
router.get('/:brand_key', apiKeyAndIpWhitelistMiddleware, getVariantBrandKey)
router.get('/users/:brand_key', authenticatedToken, getVariantBrandKeyUser)
router.post(
  '/create/:brand_key',
  apiKeyAndIpWhitelistMiddleware,
  createUserProductPrice
)
router.patch('/update', apiKeyAndIpWhitelistMiddleware, updateUserProductPrice)
router.get('/delete', apiKeyAndIpWhitelistMiddleware, deleteUserProductPrice)

module.exports = router
