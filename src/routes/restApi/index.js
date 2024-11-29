const express = require('express')
const { authenticatedToken } = require('../../middleware/authenticateToken')
const {
  createDeposit,
  checkDeposit,
  getUserVariantBrandKey,
  getUserProductRest,
  createOrderRestApi,
  checkRestOrder,
  getRestUserBalance,
} = require('../../controller/restapi')
const { apiLimiterRestApi } = require('../../middleware/customer')
const router = express.Router()

router.get('/balance', apiLimiterRestApi, getRestUserBalance)
router.post('/deposit', apiLimiterRestApi, authenticatedToken, createDeposit)
router.get(
  '/deposit/check',
  apiLimiterRestApi,
  authenticatedToken,
  checkDeposit
)
router.get('/products', apiLimiterRestApi, getUserProductRest)
router.get('/products/:brand_key', apiLimiterRestApi, getUserVariantBrandKey)
router.post('/order', apiLimiterRestApi, createOrderRestApi)
router.get('/order/check', apiLimiterRestApi, checkRestOrder)

module.exports = router
