const jwt = require('jsonwebtoken')
const { userAuthorization } = require('../helper/functions.js')
const { errorResponse } = require('../helper/http.js')
const { getUserIdByTokenQuery } = require('../model/user.js')

const authenticatedToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!authHeader)
    return errorResponse({
      res,
      message: 'Unauthorized',
      statusCode: 401,
    })

  const userLogin = userAuthorization(authHeader)

  try {
    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    if (userSelected.length === 0)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 400,
      })

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return errorResponse({
          res,
          message: 'Token tidak valid',
          statusCode: 403,
        })
      }

      req.user = user
      next()
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi Kesalahan di server',
      statusCode: 500,
    })
  }
}

module.exports = {
  authenticatedToken,
}
