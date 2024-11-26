const express = require('express')
const { apiKeyAndIpWhitelistMiddleware } = require('../middleware/customer.js')
const {
  getFlashSales,
  createNewFlashSales,
  updateFlashSales,
  deleteFlashSales,
  updateStatusFlashSales,
} = require('../controller/flasSales.js')
const { createOrderFlashSale } = require('../controller/order.js')

const router = express.Router()

router.get('/', apiKeyAndIpWhitelistMiddleware, getFlashSales)
router.post('/', apiKeyAndIpWhitelistMiddleware, createNewFlashSales)
router.post(
  '/create-order',
  apiKeyAndIpWhitelistMiddleware,
  createOrderFlashSale
)
router.patch('/:flashSaleId', apiKeyAndIpWhitelistMiddleware, updateFlashSales)
router.delete('/:flashSaleId', apiKeyAndIpWhitelistMiddleware, deleteFlashSales)
router.patch(
  '/status/:flashSaleId',
  apiKeyAndIpWhitelistMiddleware,
  updateStatusFlashSales
)

module.exports = router
