const moment = require('moment')
const {
  getIndonesianDayName,
  getYesterdayIndonesianDayName,
  calculatePercentageIncrease,
} = require('../helper/formatted')
const {
  userAuthorization,
  generateTrxId,
  createSignatureVCGamer,
  generateHashWithTimestamp,
  generateQRCode,
} = require('../helper/functions')
const {
  errorResponse,
  successResponse,
  httpVcGamer,
  httpVcGamerCreateOrder,
  httpCreateTransaction,
} = require('../helper/http')
const {
  getDashboardChartsQuery,
  getChartOrderByDayQuery,
  createOrderQuery,
} = require('../model/order')
const { getUserByApiKeyQuery } = require('../model/user')

const getDashboardChart = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)
    const month = req.query.month || new Date().getMonth() + 1
    const year = req.query.year || new Date().getFullYear()

    const [dataDashboard] = await getDashboardChartsQuery({
      month,
      year,
      userId: userLogin.id,
    })

    const daysInMonth = new Date(year, month, 0).getDate()
    const incomeByDay = []

    const [transacationChartsDay] = await getChartOrderByDayQuery({
      month,
      year,
      userId: userLogin.id,
    })

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`

      const transaction = transacationChartsDay.find((t) => {
        const transactionDate = new Date(t.date).toISOString().split('T')[0]
        return transactionDate === date
      })

      incomeByDay.push({
        date,
        amount: transaction ? transaction.amount : 0,
      })
    }

    const chartResponse = {
      income: dataDashboard[0].total_pendapatan,
      incomeMonth: dataDashboard[0].total_pendapatan_bulan_ini,
      incomeToday: dataDashboard[0].total_pendapatan_hari_ini,
      incomeYesterday: dataDashboard[0].total_pendapatan_kemarin,
      today: getIndonesianDayName(new Date()),
      yesterday: getYesterdayIndonesianDayName(),
      percentageDay:
        Math.floor(
          calculatePercentageIncrease(
            Number(dataDashboard[0].total_pendapatan_kemarin),
            Number(dataDashboard[0].total_pendapatan_hari_ini)
          )
        ) + '%',
      charts: incomeByDay,
    }

    successResponse({
      res,
      message: 'Berhasil mengambil data chart dashboard',
      statusCode: 200,
      data: chartResponse,
    })
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const createOrder = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const [userSelected] = await getUserByApiKeyQuery(token)
    const userId = userSelected[0].id

    const formData = req.body

    if (!formData.brand_key)
      return errorResponse({
        res,
        message: 'Produk tidak ditemukan',
        statusCode: 400,
      })

    if (!formData.variation_key)
      return errorResponse({
        res,
        message: 'Produk item tidak ditemukan',
        statusCode: 400,
      })

    if (!formData.price)
      return errorResponse({
        res,
        message: 'Harga tidak ditemukan',
        statusCode: 400,
      })

    const paramsSignature =
      `${process.env.VCGAMERS_SECRET}` + 'variation' + formData.brand_key
    const signature = createSignatureVCGamer(paramsSignature)
    const URL_VARIATION = `${process.env.VCGAMERS_URL_V2}/variations?sign=${signature}&brand_key=${formData.brand_key}`
    const response = await httpVcGamer(URL_VARIATION)

    const [productSelected] = response?.data.filter(
      (item) => item.key === formData.variation_key
    )

    if (formData.price < productSelected.price)
      return errorResponse({
        res,
        message: 'Harga tidak sesuai',
        statusCode: 400,
      })

    const trxId = generateTrxId()
    const signatureKey = generateHashWithTimestamp(formData.price)
    const bodyDeposit = {
      merchantCode: process.env.DUITKU_KODE_MERCHANT,
      paymentAmount: Number(formData.price),
      paymentMethod: 'SP',
      merchantOrderId: signatureKey.merchantOrderId,
      productDetails: `Create order product ${formData.variation_key}`,
      customerVaName: 'Wardigital Indonesia',
      email: 'wardigitalid@gmail.com',
      phoneNumber: '087754175829',
      itemDetails: [
        {
          name: `${formData.variation_key}`,
          price: Number(formData.price),
          quantity: 1,
        },
      ],
      customerDetail: {
        firstName: 'Wardigital',
        lastName: 'Indonesia',
        email: 'wardigitalid@gmail.com',
        phoneNumber: '087754175829',
      },
      callbackUrl: '/',
      returnUrl: '/',
      signature: signatureKey.signature,
      expiryPeriod: 15,
    }

    const responseTransaction = await httpCreateTransaction(bodyDeposit)

    if (responseTransaction.statusCode === '00') {
      const qrCodeDataURL = await generateQRCode(responseTransaction.qrString)
      // CREATE ORDER
      await createOrderQuery({
        data: JSON.stringify(formData.data),
        invoice: trxId,
        price: Number(formData.price),
        qrCode: qrCodeDataURL,
        userId,
        productId: formData.productId,
        merchantId: signatureKey.merchantOrderId,
      })
      successResponse({
        res,
        message:
          'Berhasil membuat order baru, Silahkan selesaikan pembayaranmu',
        statusCode: 200,
        data: {
          transaction_id: trxId,
        },
      })
    }
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

module.exports = {
  getDashboardChart,
  createOrder,
}
