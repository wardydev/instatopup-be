const express = require('express')
const { getUserBalance } = require('../../controller/balance')
const { authenticatedToken } = require('../../middleware/authenticateToken')
const {
  createDeposit,
  checkDeposit,
  getUserVariantBrandKey,
  getUserProductRest,
} = require('../../controller/restapi')
const router = express.Router()

router.get('/balance', authenticatedToken, getUserBalance)
router.post('/deposit', authenticatedToken, createDeposit)
router.get('/deposit/check', authenticatedToken, checkDeposit)
router.get('/products', authenticatedToken, getUserProductRest)
router.get('/products/:brand_key', authenticatedToken, getUserVariantBrandKey)

module.exports = router
