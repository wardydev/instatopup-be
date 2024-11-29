const express = require('express')
const {
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
} = require('../middleware/customer.js')
const {
  getFlashSales,
  createNewFlashSales,
  updateFlashSales,
  deleteFlashSales,
  updateStatusFlashSales,
} = require('../controller/flasSales.js')
const { createOrderFlashSale } = require('../controller/order.js')

const router = express.Router()

router.get(
  '/',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  getFlashSales
)
router.post(
  '/',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  createNewFlashSales
)
router.post(
  '/create-order',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  createOrderFlashSale
)
router.patch(
  '/:flashSaleId',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  updateFlashSales
)
router.delete(
  '/:flashSaleId',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  deleteFlashSales
)
router.patch(
  '/status/:flashSaleId',
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
  updateStatusFlashSales
)

module.exports = router
