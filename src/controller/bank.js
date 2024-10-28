const { userAuthorization } = require('../helper/functions')
const { errorResponse, successResponse } = require('../helper/http')
const {
  getBankQuery,
  ceateBankQuery,
  updateBankQuery,
  deleteBankQuery,
} = require('../model/bank')

const getUserBank = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const [userBankLists] = await getBankQuery(userLogin.id)

    successResponse({
      res,
      message: 'Berhasil mengambil data user bank',
      statusCode: 200,
      data: userBankLists,
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

const createUserBank = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const { bankName, norek, accountName } = req.body

    if (!bankName || !norek || !accountName)
      return errorResponse({
        res,
        message: 'Wajib mengisi semua form',
        statusCode: 400,
      })

    await ceateBankQuery({
      userId: userLogin.id,
      accountName,
      bankName,
      norek,
    })

    successResponse({
      res,
      message: 'Berhasil membuat user bank baru ',
      statusCode: 201,
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
const updateUserBank = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const { bankId } = req.params
    const { bankName, norek, accountName } = req.body

    if (!bankId)
      return errorResponse({
        res,
        message: 'User BankID tidak ditemukan',
        statusCode: 400,
      })

    if (!bankName || !norek || !accountName)
      return errorResponse({
        res,
        message: 'Wajib mengisi semua form',
        statusCode: 400,
      })

    await updateBankQuery({
      accountName,
      bankId: bankId,
      bankName,
      norek,
      userId: userLogin.id,
    })

    successResponse({
      res,
      message: 'Berhasil memperbarui user bank baru',
      statusCode: 201,
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

const deleteUserBank = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const { bankId } = req.params

    if (!bankId)
      return errorResponse({
        res,
        message: 'User bank id tidak ditemukan',
        statusCode: 400,
      })

    await deleteBankQuery({
      bankId: bankId,
      userId: userLogin.id,
    })

    successResponse({
      res,
      message: 'Berhasil menghapus user bank',
      statusCode: 200,
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
  getUserBank,
  createUserBank,
  updateUserBank,
  deleteUserBank,
}
