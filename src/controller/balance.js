const { userAuthorization } = require('../helper/functions')
const { errorResponse, successResponse } = require('../helper/http')
const { getUserBalanceQuery } = require('../model/balance')

const getUserBalance = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const [userBalanceSelected] = await getUserBalanceQuery(userLogin.id)

    successResponse({
      res,
      message: 'Berhasil mengambil saldo user',
      statusCode: 200,
      data: userBalanceSelected[0],
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

module.exports = { getUserBalance }
