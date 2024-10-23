const jwt = require('jsonwebtoken')
const { userAuthorization, isTokoExpired } = require('../helper/functions.js')
const { getTokoExpiredQuery, setTokoExpiredQuery } = require('../model/toko.js')
const { errorResponse } = require('../helper/apiResponse.js')
const { getUseridByToken, getUserIdQuery } = require('../model/user.js')

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const { authorization } = req.headers

  if (!authorization) {
    return errorResponse(res, 401, 'Authorization is required')
  }

  if (!token) {
    return errorResponse(res, 401, 'Token is required')
  }

  const userData = userAuthorization(authorization)

  if (!userData.id) {
    return errorResponse(
      res,
      404,
      'User tidak ditemukan, Pastikan Kamu melakukan login'
    )
  }

  // query user
  const [list] = await getUserIdQuery(userData.id)

  if (list.length === 0) {
    return errorResponse(res, 404, 'Unauthorized')
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token tidak valid.',
      })
    }

    req.user = user
    next()
  })
}

module.exports = authenticateToken
