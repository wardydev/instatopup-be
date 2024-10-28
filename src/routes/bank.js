const express = require('express')
const {
  getUserBank,
  createUserBank,
  updateUserBank,
  deleteUserBank,
} = require('../controller/bank')
const router = express.Router()

router.get('/', getUserBank)
router.post('/', createUserBank)
router.patch('/:bankId', updateUserBank)
router.delete('/:bankId', deleteUserBank)

module.exports = router
