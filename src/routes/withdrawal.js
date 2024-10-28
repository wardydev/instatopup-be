const express = require('express')
const {
  getListWithdrawalUser,
  createRequestWithdrawal,
} = require('../controller/withdrawal')
const router = express.Router()

router.get('/', getListWithdrawalUser)
router.post('/request', createRequestWithdrawal)

module.exports = router
