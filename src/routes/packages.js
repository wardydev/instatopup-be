const express = require('express')
const { getPackages } = require('../controller/packages.js')

const router = express.Router()

router.get('/', getPackages)

module.exports = router
