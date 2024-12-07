const jwt = require('jsonwebtoken')
const { userAuthorization } = require('../helper/functions.js')
const { errorResponse, successResponse } = require('../helper/http.js')
const { getUserIdByTokenQuery } = require('../model/user.js')
const {
  getStatusWebsiteQuery,
  getInvoiceQuery,
  getUserSubscription,
} = require('../model/user-website.js')

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

const checkStatusWebsite = async (req, res, next) => {
  const { authorization } = req.headers
  const userLogin = userAuthorization(authorization)

  const [websiteSelected] = await getStatusWebsiteQuery(userLogin.id)
  if (websiteSelected.length === 0)
    return errorResponse({
      res,
      message: 'Website tidak ditemukan',
      statusCode: 404,
    })

  if (websiteSelected[0].status === 'pending') {
    const [orderSelected] = await getInvoiceQuery(userLogin.id)
    return successResponse({
      res,
      message:
        'Status website masih pending, Silahkan selesaikan pembayaran terlebih dahulu',
      statusCode: 400,
      data: {
        status: 'pending',
        invoice: orderSelected[0].invoice,
      },
    })
  }

  if (websiteSelected[0].status === 'expired') {
    return successResponse({
      res,
      message:
        'Status website sudah expired, Silahkan perbarui langganan website Kamu',
      statusCode: 400,
      data: {
        status: 'expired',
      },
    })
  }

  if (websiteSelected[0].status === 'paid') {
    return successResponse({
      res,
      message: 'Pembayaran berhasil, Silahkan menunggu untuk proses aktivasi',
      statusCode: 200,
      data: {
        status: 'paid',
      },
    })
  }

  if (websiteSelected[0].status === 'success') {
    next()
  }
}

const checkUserPackage = async (req, res, next) => {
  const { authorization } = req.headers
  const userLogin = userAuthorization(authorization)

  const [subscriptionSelected] = await getUserSubscription(userLogin.id)

  if (subscriptionSelected.length === 0)
    return errorResponse({
      res,
      message: 'Subscription tidak ditemukan',
      statusCode: 404,
    })

  if (subscriptionSelected[0].package_id === 1)
    return errorResponse({
      res,
      message:
        'Mohon maaf Kamu tidak bisa menggunakan fitur ini, Silahkan Hubungi admin Kami untuk mengganti paket langganan Kamu',
      statusCode: 400,
    })

  next()
}

const authenticatedTokenAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return errorResponse({
      res,
      message: 'Unauthorized: No token provided',
      statusCode: 401,
    })
  }

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

    if (userSelected[0].email !== 'hairulwardy@gmail.com')
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })
    if (userSelected[0].full_name !== 'hairul wardy')
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    req.user = decoded
    next()
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
  checkStatusWebsite,
  checkUserPackage,
  authenticatedTokenAdmin,
}
