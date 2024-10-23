const express = require('express')
const {
  createWebsite,
  checkIsDomainAvalaible,
  checkTransaction,
} = require('../controller/member.js')

const router = express.Router()

router.post('/create', createWebsite)
router.post('/check-domain', checkIsDomainAvalaible)
router.post('/transaction', checkTransaction)

module.exports = router
