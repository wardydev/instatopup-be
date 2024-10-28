const { userAuthorization } = require('../helper/functions')
const { errorResponse, successResponse } = require('../helper/http')
const { getBankQuery } = require('../model/bank')
const {
  listWithdrawalQuery,
  getTotalBalanceQuery,
  createRequestWithdrawalQuery,
} = require('../model/withdrawal')

const getListWithdrawalUser = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const [withdrawalSelected] = await listWithdrawalQuery(userLogin.id)

    successResponse({
      res,
      message: 'Berhasil mengambil history penarikan',
      statusCode: 200,
      data: withdrawalSelected,
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

const createRequestWithdrawal = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const { amount, bankId } = req.body

    if (!amount)
      return errorResponse({
        res,
        message: 'Jumlah diterima kosong',
        statusCode: 400,
      })
    if (!bankId)
      return errorResponse({
        res,
        message: 'Bank tidak ditemukan',
        statusCode: 400,
      })

    //   check bank
    const [bankSelected] = await getBankQuery(userLogin.id)
    if (bankSelected.length === 0)
      return errorResponse({
        res,
        message: 'Bank tidak valid',
        statusCode: 400,
      })

    //   check balance
    const [balanceSelected] = await getTotalBalanceQuery(userLogin.id)

    console.log(balanceSelected)

    if (Number(amount) > Number(balanceSelected[0].balance))
      return errorResponse({
        res,
        message: 'Jumlah yang diterima tidak sesuai dengan jumlah saldo Kamu',
        statusCode: 400,
      })

    await createRequestWithdrawalQuery({
      amount,
      bankId,
      userId: userLogin.id,
    })

    // tambahkan pesan ke owner kalau ada user sedang melakukan penarikan

    successResponse({
      res,
      message: `Berhasil membuat request penarikan dana sejumlah ${amount}, Silahkan menunggu dana Kamu akan dikirim dalam waktu 1x24 Jam`,
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
  getListWithdrawalUser,
  createRequestWithdrawal,
}
