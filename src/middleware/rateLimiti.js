const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Terlalu banyak request dari IP ini, coba lagi nanti.',
  statusCode: 400,
})

module.exports = apiLimiter
