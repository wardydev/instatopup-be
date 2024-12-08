const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const {
  uploadLogo,
  uploadBanner,
  deleteLogo,
  getUserLogo,
  getUserBanner,
} = require('../controller/user-media.js')
const {
  authenticatedToken,
  checkUserPackage,
} = require('../middleware/authenticateToken.js')
const { apiLimiterRestApi } = require('../middleware/customer.js')

const router = express.Router()

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('Hanya file PNG yang diperbolehkan'), false) // Tolak file
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 200 * 1024 },
})

const uploadBannerConfig = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})

router.post(
  '/upload-logo',
  authenticatedToken,
  checkUserPackage,
  upload.single('photo'),
  uploadLogo
)
router.post(
  '/upload-banner',
  authenticatedToken,
  checkUserPackage,
  uploadBannerConfig.single('photo'),
  uploadBanner
)
router.delete('/:id', authenticatedToken, apiLimiterRestApi, deleteLogo)
router.get('/logo', authenticatedToken, apiLimiterRestApi, getUserLogo)
router.get('/banner', authenticatedToken, apiLimiterRestApi, getUserBanner)

module.exports = router
