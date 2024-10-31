const express = require('express')
const {
  loginUser,
  verifyOtp,
  getUserInfo,
  sendOTPResetPassword,
  resetPassword,
} = require('../controller/user.js')
const { authenticatedToken } = require('../middleware/authenticateToken.js')

const router = express.Router()

router.post('/auth/login', loginUser)
router.post('/auth/verify', verifyOtp)
router.get('/', authenticatedToken, getUserInfo)
router.post('/reset-password-otp', sendOTPResetPassword)
router.post('/reset-password', resetPassword)

module.exports = router
