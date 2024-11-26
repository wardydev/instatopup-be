const jwt = require('jsonwebtoken')
const { userAuthorization } = require('../helper/functions.js')
const { errorResponse } = require('../helper/http.js')
const { getUserIdByTokenQuery } = require('../model/user.js')

const authenticatedToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return errorResponse({
      res,
      message: 'Unauthorized: No token provided',
      statusCode: 401,
    })
  }

  // const userLogin = userAuthorization(authHeader)

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY, {
      ignoreExpiration: true,
    })
    if (decoded.exp * 1000 < Date.now()) {
      return errorResponse({
        res,
        message: 'Token has expired',
        statusCode: 401,
      })
    }

    const [userSelected] = await getUserIdByTokenQuery(decoded.id)
    if (!userSelected || userSelected.length === 0) {
      return errorResponse({
        res,
        message: 'Unauthorized: User not found',
        statusCode: 401,
      })
    }

    req.user = decoded
    next()

    // const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    // if (userSelected.length === 0)
    //   return errorResponse({
    //     res,
    //     message: 'Unauthorized',
    //     statusCode: 400,
    //   })

    // jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    //   console.log(err, 'ERROR')
    //   console.log(user, 'USER')
    //   if (err) {
    //     if (err.name === 'TokenExpiredError')
    //       return errorResponse({
    //         res,
    //         message: 'Token has expired',
    //         statusCode: 401,
    //       })

    //     return errorResponse({
    //       res,
    //       message: 'Token is invalid',
    //       statusCode: 403,
    //     })
    //   }

    //   req.user = user
    //   next()
    // })
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
