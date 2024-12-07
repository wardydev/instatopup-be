const express = require('express')
const {
  createWebsite,
  checkIsDomainAvalaible,
  checkTransaction,
  getTransaction,
  updateNewCustomDomain,
  getListUserWebsite,
  checkIpDomain,
  checkStatusWebsite,
  getUserWebsiteStatus,
} = require('../controller/member.js')
const {
  authenticatedToken,
  checkUserPackage,
} = require('../middleware/authenticateToken.js')
const apiLimiter = require('../middleware/rateLimiti.js')
const { apiLimiterRestApi } = require('../middleware/customer.js')

const router = express.Router()

router.post('/create', apiLimiter, createWebsite)
router.post(
  '/check-domain',
  apiLimiter,
  // checkUserPackage,
  checkIsDomainAvalaible
)
router.post('/transaction', apiLimiterRestApi, checkTransaction)
router.get('/transaction', apiLimiterRestApi, getTransaction)
router.patch(
  '/custom-domain',
  authenticatedToken,
  apiLimiterRestApi,
  // checkUserPackage,
  updateNewCustomDomain
)
router.get('/', authenticatedToken, apiLimiterRestApi, getListUserWebsite)
router.post(
  '/check-ip',
  authenticatedToken,
  apiLimiterRestApi,
  // checkUserPackage,
  checkIpDomain
)
router.get(
  '/check-status',
  authenticatedToken,
  apiLimiterRestApi,
  // checkUserPackage,
  getUserWebsiteStatus
)

module.exports = router
