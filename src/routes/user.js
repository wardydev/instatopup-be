const express = require('express')
const {
  loginUser,
  verifyOtp,
  getUserInfo,
  sendOTPResetPassword,
  resetPassword,
} = require('../controller/user.js')

const router = express.Router()

router.post('/auth/login', loginUser)
router.post('/auth/verify', verifyOtp)
router.get('/', getUserInfo)
router.post('/reset-password-otp', sendOTPResetPassword)
router.post('/reset-password', resetPassword)

module.exports = router
