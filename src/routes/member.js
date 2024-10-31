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

const router = express.Router()

router.post('/create', apiLimiter, createWebsite)
router.post('/check-domain', apiLimiter, checkIsDomainAvalaible)
router.post('/transaction', checkTransaction)
router.get('/transaction', getTransaction)
router.patch('/custom-domain', authenticatedToken, updateNewCustomDomain)
router.get('/', authenticatedToken, getListUserWebsite)
router.post('/check-ip', authenticatedToken, checkIpDomain)

module.exports = router
