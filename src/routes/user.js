const express = require('express')
const {
  loginUser,
  verifyOtp,
  getUserInfo,
  sendOTPResetPassword,
  resetPassword,
} = require('../controller/user.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')
const { apiLimiterRestApi } = require('../middleware/customer.js')

const router = express.Router()

router.post('/auth/login', apiLimiterRestApi, loginUser)
router.post('/auth/verify', apiLimiterRestApi, verifyOtp)
router.get('/', authenticatedToken, apiLimiterRestApi, getUserInfo)
router.post('/reset-password-otp', apiLimiterRestApi, sendOTPResetPassword)
router.post('/reset-password', apiLimiterRestApi, resetPassword)

module.exports = router
