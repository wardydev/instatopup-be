const express = require('express')
const {
  createWebsite,
  checkIsDomainAvalaible,
} = require('../controller/member.js')

const router = express.Router()

router.post('/create', createWebsite)
router.post('/check-domain', checkIsDomainAvalaible)

module.exports = router
