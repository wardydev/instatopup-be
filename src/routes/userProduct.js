const express = require('express')
const { authenticatedToken } = require('../middleware/authenticateToken.js')
const {
  createUserProductPrice,
  updateUserProductPrice,
  resetUserProductPrice,
  hideUserProduct,
  showUserProduct,
} = require('../controller/userProduct.js')
const router = express.Router()

router.post('/item/:brand_key', authenticatedToken, createUserProductPrice)
router.patch(
  '/item/:brand_key/:itemKey',
  authenticatedToken,
  updateUserProductPrice
)
router.delete('/item/:itemKey', authenticatedToken, resetUserProductPrice)
router.post('/hide', authenticatedToken, hideUserProduct)
router.delete('/show/:productId/:brandKey', authenticatedToken, showUserProduct)

module.exports = router
