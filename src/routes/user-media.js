const express = require('express')
const multer = require('multer')
const path = require('path')
const {
  uploadLogo,
  uploadBanner,
  deleteLogo,
} = require('../controller/user-media.js')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
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

router.post('/upload-logo', upload.single('photo'), uploadLogo)
router.post('/upload-banner', uploadBannerConfig.single('photo'), uploadBanner)
router.delete('/:id', deleteLogo)

module.exports = router
