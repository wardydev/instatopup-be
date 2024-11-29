const express = require('express')
const {
  createWebsite,
  checkIsDomainAvalaible,
  checkTransaction,
  getTransaction,
  updateNewCustomDomain,
  getListUserWebsite,
  checkIpDomain,
} = require('../controller/member.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')
const apiLimiter = require('../middleware/rateLimiti.js')
const { apiLimiterRestApi } = require('../middleware/customer.js')

const router = express.Router()

router.post('/create', apiLimiter, createWebsite)
router.post('/check-domain', apiLimiter, checkIsDomainAvalaible)
router.post('/transaction', apiLimiterRestApi, checkTransaction)
router.get('/transaction', apiLimiterRestApi, getTransaction)
router.patch(
  '/custom-domain',
  authenticatedToken,
  apiLimiterRestApi,
  updateNewCustomDomain
)
router.get('/', authenticatedToken, apiLimiterRestApi, getListUserWebsite)
router.post('/check-ip', authenticatedToken, apiLimiterRestApi, checkIpDomain)

module.exports = router
