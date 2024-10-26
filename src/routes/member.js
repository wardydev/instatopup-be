const express = require('express')
const {
  createWebsite,
  checkIsDomainAvalaible,
  checkTransaction,
  getTransaction,
} = require('../controller/member.js')

const router = express.Router()

router.post('/create', createWebsite)
router.post('/check-domain', checkIsDomainAvalaible)
router.post('/transaction', checkTransaction)
router.get('/transaction', getTransaction)

module.exports = router
