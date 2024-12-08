const { ADMIN_FEE } = require('../helper/constants')
const { formatRupiah, formatDate } = require('../helper/formatted')
const { userAuthorization } = require('../helper/functions')
const {
  errorResponse,
  successResponse,
  httpCreateMessage,
} = require('../helper/http')
const { getBankQuery } = require('../model/bank')
const { getUserIdByTokenQuery } = require('../model/user')
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
    const newWithdarawlData = withdrawalSelected.map((item) => {
      const amountWithAdminFee = item.amount * ADMIN_FEE
      const finalAmount = item.amount - amountWithAdminFee
      return {
        ...item,
        amount: finalAmount,
      }
    })

    successResponse({
      res,
      message: 'Berhasil mengambil history penarikan',
      statusCode: 200,
      data: newWithdarawlData,
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
    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    const { amount, bankId, bankName } = req.body

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
    if (!bankName)
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

    if (balanceSelected.length === 0)
      return errorResponse({
        res,
        message: 'Saldo tidak ditemukan',
        statusCode: 400,
      })

    const amountWithAdminFee = Number(amount) * ADMIN_FEE
    const finalAmount = amount - amountWithAdminFee

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
    const message = `Halo, ${userSelected[0].full_name}!

Kami telah menerima permintaan withdraw Anda. Berikut detailnya:

Jumlah Withdraw: ${formatRupiah(finalAmount)}
Biaya Admin: 0.01
Metode Pembayaran: ${bankName}
Tanggal Permintaan: ${formatDate(new Date())}
Permintaan Anda sedang kami proses dan diperkirakan akan selesai dalam 1 hari kerja. Kami akan mengirimkan notifikasi setelah dana berhasil ditransfer.

Jika ada pertanyaan atau kendala, silakan hubungi tim support kam

Terima kasih telah menggunakan layanan kami! 😊

Hormat kami,
WARDYGITAL`
    await httpCreateMessage({ message, phone: userSelected[0].phone_number })

    successResponse({
      res,
      message: `Berhasil membuat request penarikan dana, Silahkan menunggu dana Kamu akan dikirim dalam waktu 1x24 Jam`,
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
