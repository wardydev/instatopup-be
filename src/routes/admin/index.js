const express = require('express')
const { apiLimiterRestApi } = require('../../middleware/customer')
const {
  activateUserWebsite,
  listUserWebsite,
  getListsWithdrwal,
  approveRequestSettlement,
  getTotalSummarizedQuery,
} = require('../../controller/admin')
const {
  authenticatedTokenAdmin,
} = require('../../middleware/authenticateToken')
const router = express.Router()

router.post(
  '/activate',
  apiLimiterRestApi,
  authenticatedTokenAdmin,
  activateUserWebsite
)
router.get(
  '/lists',
  apiLimiterRestApi,
  authenticatedTokenAdmin,
  listUserWebsite
)
router.get(
  '/withdrawal',
  apiLimiterRestApi,
  authenticatedTokenAdmin,
  getListsWithdrwal
)
router.patch(
  '/withdrawal/approve',
  apiLimiterRestApi,
  authenticatedTokenAdmin,
  approveRequestSettlement
)
router.get(
  '/transaction-amount',
  apiLimiterRestApi,
  authenticatedTokenAdmin,
  getTotalSummarizedQuery
)

module.exports = router
