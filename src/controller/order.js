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
  generateSignatureCheckTranasction,
} = require('../helper/functions')
const {
  errorResponse,
  successResponse,
  httpVcGamer,
  httpVcGamerCreateOrder,
  httpCreateTransaction,
  httpCheckTransaction,
} = require('../helper/http')
const {
  getDashboardChartsQuery,
  getChartOrderByDayQuery,
  createOrderQuery,
  getOrderByTrxidQuery,
  updateOrderStatusQuery,
} = require('../model/order')
const { getUserByApiKeyQuery } = require('../model/user')
const {
  updateBalanceUserQuery,
  getUserBalanceQuery,
} = require('../model/balance')

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

const createPayment = async (req, res) => {
  try {
    const { trx_id } = req.query

    if (!trx_id)
      return errorResponse({
        res,
        message: 'Pesanan tidak ditemukan, Pastikan id transaksi benar',
        statusCode: 404,
      })

    const [orderSelected] = await getOrderByTrxidQuery(trx_id)
    const orderRecord = orderSelected[0]

    console.log(orderRecord, 'ORDER RECORD')

    if (orderSelected.length === 0)
      return errorResponse({
        res,
        message: 'Pesanan tidak ditemukan, Pastikan id transaksi benar',
        statusCode: 404,
      })

    // check payment
    const signatureKey = generateSignatureCheckTranasction(
      orderRecord.merchant_id
    )
    const checkResponse = await httpCheckTransaction({
      merchantCode: process.env.DUITKU_KODE_MERCHANT,
      merchantOrderId: orderRecord.merchant_id,
      signature: signatureKey,
    })

    console.log(checkResponse, 'CHECK PAYMENT RESPONSE')

    if (checkResponse.statusCode === '00') {
      // create order
      const timeStamps = moment().unix()
      const createOrderBody = {
        brand_key: String(orderRecord.brand_key),
        variation_key: String(orderRecord.variation_key),
        price: Number(orderRecord.total_price),
        ref_id: String(orderRecord.invoice),
        data: JSON.parse(orderRecord.data),
        timestamp: String(timeStamps),
      }
      const paramsCreateOrderSignature =
        `${process.env.VCGAMERS_SECRET}` +
        'order' +
        orderRecord.brand_key +
        orderRecord.variation_key +
        orderRecord.total_price +
        orderRecord.invoice +
        timeStamps
      const createOrderSignature = createSignatureVCGamer(
        paramsCreateOrderSignature
      )
      const URL_CREATE_ORDER = `${process.env.VCGAMERS_URL_V2}/order?sign=${createOrderSignature}`
      const responseOrder = await httpVcGamerCreateOrder(
        URL_CREATE_ORDER,
        JSON.stringify(createOrderBody)
      )

      console.log(responseOrder, 'RESPONSE ORDER')

      if (responseOrder.code === 400)
        return errorResponse({
          res,
          message:
            'Order gagal dibuat, Silahkan lakukan konfirmasi ke admin untuk ajukan pengembalian dana',
          statusCode: 400,
        })

      if (responseOrder.code === 404)
        return errorResponse({
          res,
          message:
            'Produk tidak ditemukan, Silahkan lakukan konfirmasi ke admin untuk ajukan pengembalian dana',
          statusCode: 404,
        })

      if (responseOrder.status === 'SUCCESS') {
        const [balanceSelected] = await getUserBalanceQuery(orderRecord.user_id)
        await updateOrderStatusQuery({
          status: 'paid',
          trxId: orderRecord.invoice,
          userId: orderRecord.user_id,
        })

        await updateBalanceUserQuery({
          userId: orderRecord.user_id,
          amount: orderRecord.total_price,
          totalBalance:
            Number(orderRecord.total_price) +
            Number(balanceSelected[0].balance),
        })

        successResponse({
          res,
          message: 'Pesanan Kamu berhasil di proses, Tunggu sebentar ya',
          statusCode: 200,
          data: {
            status: 'success',
            transaction_id: orderRecord.invoice,
            total_price: orderRecord.total_price,
          },
        })
      }
    } else if (checkResponse.statusCode === '02') {
      await updateOrderStatusQuery({
        status: 'cancel',
        trxId: orderRecord.invoice,
        userId: orderRecord.user_id,
      })
      errorResponse({
        res,
        message: 'Pembayaran expired',
        statusCode: 400,
      })
    } else {
      successResponse({
        res,
        message: 'Status pembayaran pending',
        statusCode: 200,
        data: {
          status: 'pending',
          transaction_id: orderRecord.invoice,
          total_price: orderRecord.total_price,
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

const checkStatusProduct = async (req, res) => {
  try {
    const { trx_id } = req.body
    if (!trx_id)
      return errorResponse({
        res,
        message: 'Id transaksi tidak ditemukan',
        statusCode: 400,
      })

    const [orderSelected] = await getOrderByTrxidQuery(trx_id)
    const orderRecord = orderSelected[0]

    const paramsSignature =
      `${process.env.VCGAMERS_SECRET}` + 'orderstatus' + orderRecord.invoice
    const signature = createSignatureVCGamer(paramsSignature)
    const URL_ORDER_STATUS = `${process.env.VCGAMERS_URL_V2}/order-status?sign=${signature}&tid=${orderRecord.invoice}`
    const response = await httpVcGamer(URL_ORDER_STATUS)

    console.log(response, 'response')

    if (response.data.status === 1)
      return successResponse({
        res,
        message: 'Transaksi Kamu sedang di proses, Silahkan menunggu sebentar',
        statusCode: 200,
      })

    if (
      response?.data?.history_status.length > 2 &&
      response?.data?.history_status[2].status_name.includes('Refund')
    ) {
      await updateOrderStatusQuery({
        status: 'refund',
        trxId: orderRecord.invoice,
        userId: orderRecord.user_id,
      })

      return successResponse({
        res,
        message: `Mohon maaf produk kosong, Pesanan dengan id transaksi ${trx_id} gagal di proses`,
        statusCode: 200,
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
  checkStatusProduct,
  createPayment,
}
