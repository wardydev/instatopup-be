const { errorResponse } = require('../helper/http')
const { getIpWhitelistUserQuery } = require('../model/ipAddress')
const { getUserByApiKeyQuery } = require('../model/user')
const rateLimit = require('express-rate-limit')

const apiKeyAndIpWhitelistMiddleware = async (req, res, next) => {
  try {
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    // const clientIp = req.ip

    // if (!token || !authHeader)
    //   return errorResponse({
    //     res,
    //     message: 'Unauthorized',
    //     statusCode: 401,
    //   })

    // const [userSelected] = await getUserByApiKeyQuery(token)

    // if (userSelected.length === 0)
    //   return errorResponse({
    //     res,
    //     message: 'Invalid API Key',
    //     statusCode: 401,
    //   })

    // if (!clientIp)
    //   return errorResponse({
    //     res,
    //     message: 'IP Tidak ditemukan',
    //     statusCode: 400,
    //   })

    // const [ipSelected] = await getIpWhitelistUserQuery({
    //   ipAddress: clientIp,
    //   userId: userSelected[0].id,
    // })

    // if (ipSelected.length === 0)
    //   return errorResponse({
    //     res,
    //     message: 'IP address not allowed',
    //     statusCode: 401,
    //   })

    next()
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const apiLimiterRestApi = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: 'Terlalu banyak request dari IP ini, coba lagi nanti.',
  statusCode: 400,
})

module.exports = {
  apiKeyAndIpWhitelistMiddleware,
  apiLimiterRestApi,
}
