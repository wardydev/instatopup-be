const moment = require('moment')
const {
  userAuthorization,
  generateHashWithTimestamp,
  generateQRCode,
  generateTrxId,
  generateSignatureCheckTranasction,
  createSignatureVCGamer,
} = require('../../helper/functions')
const {
  successResponse,
  httpCheckTransaction,
  errorResponse,
  httpCreateTransaction,
  httpVcGamer,
  httpVcGamerCreateOrder,
} = require('../../helper/http')
const {
  updateBalanceUserQuery,
  getUserBalanceQuery,
  getUserBalanceDepositQuery,
  updateBalanceUserRestQuery,
} = require('../../model/balance')
const {
  userProductQuery,
  getProductsQuery,
  getProfitQuery,
  getProductByBrandKeyQuery,
} = require('../../model/products')
const {
  createDepositQuery,
  getDepositByTrxIdQuery,
  updateDepositStatusQuery,
  historyDepositListsQuery,
  getTotalDepositHistoryQuery,
} = require('../../model/restApi')
const {
  getUserIdByTokenQuery,
  getUserByApiKeyQuery,
} = require('../../model/user')
const { getUserProductHideQuery } = require('../../model/userProduct')
const {
  createOrderQuery,
  getOrderByUserTrxidQuery,
  updateOrderStatusQuery,
  updateTrxIdQuery,
} = require('../../model/order')

const getRestUserBalance = async (req, res) => {
  try {
    const { signature } = req.query

    if (!signature)
      return errorResponse({
        res,
        message: 'Signature not found',
        statusCode: 401,
      })

    const [userSelected] = await getUserByApiKeyQuery(signature)

    if (userSelected.length === 0)
      return errorResponse({
        res,
        message: 'Signature invalid',
        statusCode: 401,
      })

    const [userBalanceSelected] = await getUserBalanceQuery(userSelected[0].id)

    successResponse({
      res,
      message: 'Successfully retrieved user balance data',
      statusCode: 200,
      data: userBalanceSelected[0],
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'An error occurred on the server',
      statusCode: 500,
    })
  }
}

const createDeposit = async (req, res) => {
  try {
    const { authorization } = req.headers
    const userLogin = userAuthorization(authorization)

    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    const { amount } = req.body

    if (!amount)
      return errorResponse({
        res,
        message: 'Deposit amount not found',
        statusCode: 404,
      })

    const trxId = generateTrxId()
    const signatureKey = generateHashWithTimestamp(Number(amount))
    const bodyDeposit = {
      merchantCode: process.env.DUITKU_KODE_MERCHANT,
      paymentAmount: Number(amount),
      paymentMethod: 'SP',
      merchantOrderId: signatureKey.merchantOrderId,
      productDetails: `Create new user product`,
      customerVaName: userSelected[0].full_name,
      email: userSelected[0].email,
      phoneNumber: userSelected[0].phone_number,
      itemDetails: [
        {
          name: `User Deposit Rp ${amount}`,
          price: Number(amount),
          quantity: 1,
        },
      ],
      customerDetail: {
        firstName: userSelected[0].full_name,
        lastName: '',
        email: userSelected[0].email,
        phoneNumber: userSelected[0].phone_number,
      },
      callbackUrl: '/',
      returnUrl: '/',
      signature: signatureKey.signature,
      expiryPeriod: 15,
    }

    const responseTransaction = await httpCreateTransaction(bodyDeposit)

    if (responseTransaction.statusCode === '00') {
      const qrCodeDataURL = await generateQRCode(responseTransaction.qrString)

      await createDepositQuery({
        amount,
        qrCode: qrCodeDataURL,
        status: 'pending',
        userId: userSelected[0].id,
        merchantId: signatureKey.merchantOrderId,
        trxCode: trxId,
      })
      successResponse({
        res,
        message:
          'Berhasil membuat order baru, Silahkan selesaikan pembayaranmu',
        statusCode: 200,
        data: {
          transaction_id: trxId,
          amount,
          paymentMethod: 'QRIS',
          qrCode: qrCodeDataURL,
        },
      })
    }
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'An error occurred on the server',
      statusCode: 500,
    })
  }
}

const checkDeposit = async (req, res) => {
  try {
    const { authorization } = req.headers
    const userLogin = userAuthorization(authorization)

    const { trxId } = req.query

    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    if (!trxId)
      return errorResponse({
        res,
        message: 'Transaction id not found',
        statusCode: 404,
      })

    const [userDepositSelected] = await getDepositByTrxIdQuery({
      trxId: trxId,
      userId: userSelected[0].id,
    })

    if (userDepositSelected.length === 0)
      return errorResponse({
        res,
        message: `Transaction id not found`,
        statusCode: 404,
      })

    const signatureKey = generateSignatureCheckTranasction(
      String(userDepositSelected[0].merchant_id)
    )

    const checkResponse = await httpCheckTransaction({
      merchantCode: process.env.DUITKU_KODE_MERCHANT,
      merchantOrderId: String(userDepositSelected[0].merchant_id),
      signature: signatureKey,
    })

    if (checkResponse?.statusCode === '00') {
      const [balanceSelected] = await getUserBalanceQuery(userSelected[0].id)

      await updateBalanceUserQuery({
        amount: userDepositSelected[0].amount,
        description: 'deposit',
        totalBalance:
          Number(userDepositSelected[0].amount) +
          Number(balanceSelected[0].balance),
        userId: userSelected[0].id,
        type: '+',
      })
      await updateDepositStatusQuery({
        status: 'success',
        trxId: userDepositSelected[0].trx_id,
        userId: userSelected[0].id,
      })

      return successResponse({
        res,
        message: 'Deposit success',
        statusCode: 200,
        data: {
          status: 'success',
        },
      })
    } else if (checkResponse?.statusCode === '02') {
      await updateDepositStatusQuery({
        status: 'cancel',
        trxId: userDepositSelected[0].trx_id,
        userId: userSelected[0].id,
      })
      return successResponse({
        res,
        message: 'Payment Expired',
        statusCode: 200,
      })
    } else {
      return successResponse({
        res,
        message: 'Waiting for payment, please complete your payment',
        statusCode: 200,
        data: {
          status: 'pending',
          transaction_id: userDepositSelected[0].trx_id,
          amount: userDepositSelected[0].amount,
          qrCode: userDepositSelected[0].qr_code,
          createdAt: userDepositSelected[0].created_at,
        },
      })
    }
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'An error occurred on the server',
      statusCode: 500,
    })
  }
}

const getHistoryDeposit = async (req, res) => {
  try {
    const { authorization } = req.headers
    const userLogin = userAuthorization(authorization)

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const [historyLists] = await historyDepositListsQuery({
      userId: userLogin.id,
      offset,
      limit,
    })

    const [[{ total }]] = await getTotalDepositHistoryQuery(userLogin.id)
    console.log(getTotalDepositHistoryQuery)
    const totalPages = Math.ceil(total / limit)

    successResponse({
      res,
      message: 'Berhasil mengambil data history deposit',
      statusCode: 200,
      data: historyLists,
      meta: {
        page,
        limit,
        totalRecords: total,
        totalPages,
      },
    })
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'An error occurred on the server',
      statusCode: 500,
    })
  }
}

const getUserVariantBrandKey = async (req, res) => {
  try {
    const { sign } = req.query
    if (!sign)
      return errorResponse({
        res,
        message: 'Signature not found',
        statusCode: 401,
      })

    const [userSelected] = await getUserByApiKeyQuery(sign)

    if (userSelected.length === 0)
      return errorResponse({
        res,
        message: 'Signature invalid',
        statusCode: 401,
      })

    const { brand_key } = req.params
    if (!brand_key)
      return errorResponse({
        res,
        message: 'Brand key tidak ditemukan',
        statusCode: 400,
      })

    const paramsSignature =
      `${process.env.VCGAMERS_SECRET}` + 'variation' + brand_key
    const signature = createSignatureVCGamer(paramsSignature)
    const URL_VARIATION = `${process.env.VCGAMERS_URL_V2}/variations?sign=${signature}&brand_key=${brand_key}`
    const response = await httpVcGamer(URL_VARIATION)

    if (response.code !== 200)
      return errorResponse({
        res,
        message: 'Gagal mengambil detail produk',
        statusCode: 400,
      })

    const [userProductSelected] = await userProductQuery(
      userSelected[0].api_key
    )
    const [profitSelected] = await getProfitQuery()

    const updatedDataProducts = response?.data?.map((product) => {
      const userPriceItem = userProductSelected.find(
        (userItem) => userItem.product_item_key === product.key
      )

      if (userPriceItem) {
        return {
          ...product,
          price: userPriceItem.price,
          isCustom: true,
        }
      }

      return product
    })

    const [productByBrandKey] = await getProductByBrandKeyQuery(brand_key)

    successResponse({
      res,
      message: 'Berhasil mengambil semua data',
      statusCode: 200,
      data: {
        items: updatedDataProducts,
        tutorial_topup: productByBrandKey[0].how_to,
        image_url: productByBrandKey[0].image_url,
        forms: JSON.parse(productByBrandKey[0].forms),
        productName: productByBrandKey[0].name,
        productId: productByBrandKey[0].id,
      },
    })
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'An error occurred on the server',
      statusCode: 500,
    })
  }
}

const getUserProductRest = async (req, res) => {
  try {
    const { sign } = req.query
    if (!sign)
      return errorResponse({
        res,
        message: 'Signature not found',
        statusCode: 401,
      })

    const [userSelected] = await getUserByApiKeyQuery(sign)

    if (userSelected.length === 0)
      return errorResponse({
        res,
        message: 'Signature invalid',
        statusCode: 401,
      })

    const { q } = req.query

    const [productSelected] = await getProductsQuery(q)
    const [userProductSelected] = await getUserProductHideQuery(
      userSelected[0].api_key
    )

    function getFilteredProducts(products, userProducts) {
      return products.filter((product) => {
        return !userProducts.some((userProduct) => {
          return (
            product.id === userProduct.productId &&
            product.brand_key === userProduct.brand_key
          )
        })
      })
    }

    const filteredProducts = getFilteredProducts(
      productSelected,
      userProductSelected
    )

    successResponse({
      res,
      message: 'Berhasil mengambil semua produk',
      statusCode: 200,
      data: filteredProducts,
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'An error occurred on the server',
      statusCode: 500,
    })
  }
}

const createOrderRestApi = async (req, res) => {
  try {
    const { sign } = req.query
    if (!sign)
      return errorResponse({
        res,
        message: 'Signature not found',
        statusCode: 401,
      })

    const [userSelected] = await getUserByApiKeyQuery(sign)

    if (userSelected.length === 0)
      return errorResponse({
        res,
        message: 'Signature invalid',
        statusCode: 401,
      })

    const formData = req.body

    if (!formData.brand_key)
      return errorResponse({
        res,
        message: 'Brand key is required!',
        statusCode: 400,
      })

    if (!formData.variation_key)
      return errorResponse({
        res,
        message: 'Variation Key is required!',
        statusCode: 400,
      })

    if (!formData.price)
      return errorResponse({
        res,
        message: 'Price is required',
        statusCode: 400,
      })

    const userRecord = userSelected[0]

    const [userDepositBalance] = await getUserBalanceDepositQuery(userRecord.id)

    if (userDepositBalance.length === 0)
      return errorResponse({
        res,
        message:
          'Your deposit balance is empty. Make a deposit first to be able to continue the order creation process.',
        statusCode: 404,
      })

    if (Number(userDepositBalance[0].balance) < Number(formData.price))
      return errorResponse({
        res,
        message:
          'Your balance is not enough to order this product. Make a deposit first to continue the order creation process.',
        statusCode: 404,
      })

    const paramsSignature =
      `${process.env.VCGAMERS_SECRET}` + 'variation' + formData.brand_key
    const signature = createSignatureVCGamer(paramsSignature)
    const URL_VARIATION = `${process.env.VCGAMERS_URL_V2}/variations?sign=${signature}&brand_key=${formData.brand_key}`
    const response = await httpVcGamer(URL_VARIATION)

    const [productSelected] = response?.data.filter(
      (item) => item.key === formData.variation_key
    )

    console.log(productSelected, 'PRODUK SELECTED')

    if (Number(formData.price) < Number(productSelected.price))
      return errorResponse({
        res,
        message: 'Price does not match',
        statusCode: 400,
      })

    const timeStamps = moment().unix()
    const trxId = generateTrxId()
    const [productByBrandKey] = await getProductByBrandKeyQuery(
      formData.brand_key
    )
    const productRecord = productByBrandKey[0]

    await createOrderQuery({
      brandKey: formData.brand_key,
      data: JSON.stringify(formData.data),
      invoice: trxId,
      merchantId: null,
      price: formData.price,
      productId: productRecord.id,
      qrCode: null,
      userId: userRecord.id,
      variationKey: formData.variation_key,
    })

    successResponse({
      res,
      message: 'Successfully created a new order',
      statusCode: 200,
      data: {
        transaction_id: trxId,
        total_price: formData.price,
        date: timeStamps,
      },
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'An error occurred on the server',
      statusCode: 500,
    })
  }
}

const checkOrderFunc = async (trxId) => {
  const paramsSignature =
    `${process.env.VCGAMERS_SECRET}` + 'orderstatus' + trxId
  const signature = createSignatureVCGamer(paramsSignature)
  const URL_ORDER_STATUS = `${process.env.VCGAMERS_URL_V2}/order-status?sign=${signature}&tid=${trxId}`
  const response = await httpVcGamer(URL_ORDER_STATUS)

  return response
}

const checkRestOrder = async (req, res) => {
  try {
    const { sign, trxId } = req.query
    if (!sign)
      return errorResponse({
        res,
        message: 'Signature not found',
        statusCode: 401,
      })

    const [userSelected] = await getUserByApiKeyQuery(sign)

    if (userSelected.length === 0)
      return errorResponse({
        res,
        message: 'Signature invalid',
        statusCode: 401,
      })

    if (!trxId)
      return errorResponse({
        res,
        message: 'Transaksi id wajib diiisi',
        statusCode: 404,
      })

    const userRecord = userSelected[0]

    const [orderSelected] = await getOrderByUserTrxidQuery(trxId, userRecord.id)

    if (orderSelected.length === 0)
      return errorResponse({
        res,
        message: `Order with id ${trxId} not found, Make sure you have created an order before`,
        statusCode: 404,
      })

    const orderRecord = orderSelected[0]

    // CHECK IF SUCCESS RETURN RESPONSE SUCCESS
    if (orderRecord.status === 'success' && orderRecord.trx_id) {
      const responseCheck = await checkOrderFunc(orderRecord.trx_id)
      return successResponse({
        res,
        message: 'Successfully created new order',
        statusCode: 200,
        data: {
          transaction_id: orderRecord.invoice,
          total_price: orderRecord.total_price,
          status: 'success',
          product_detail: {
            variation_key: responseCheck.data.detail.variation_key,
            variation_name: responseCheck.data.detail.variation_name,
            price: orderRecord.total_price,
            customer_data:
              JSON.parse(orderRecord.data).map((item) => ({
                [item.key]: item.value,
              })) || [],
            voucher_code: responseCheck.data.detail.voucher_code,
          },
          history_status: responseCheck.data.history_status,
        },
      })
    }

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

    console.log(responseOrder, 'RESPOMSE')

    if (
      responseOrder.code === 500 ||
      responseOrder.code === 400 ||
      responseOrder.code === 404
    )
      return errorResponse({
        res,
        message:
          'An error occurred in the order creation process. Make sure the data entered is correct.',
        statusCode: 400,
      })

    if (responseOrder.status === 'PENDING') {
      return successResponse({
        res,
        statusCode: 200,
        message:
          'Your order has been successfully created, please wait a moment for the process.',
        data: {
          status: 'pending',
          transaction_id: orderRecord.invoice,
        },
      })
    }

    if (responseOrder.status === 'SUCCESS') {
      const [userBalance] = await getUserBalanceDepositQuery(orderRecord.id)

      await updateOrderStatusQuery({
        status: 'success',
        trxId: orderRecord.invoice,
        userId: userRecord.id,
      })

      await updateTrxIdQuery({
        invoice: orderRecord.invoice,
        trxId: responseOrder.data.trx_code,
        userId: userRecord.id,
      })

      // check response
      const responseCheck = await checkOrderFunc(responseOrder.data.trx_code)
      if (responseCheck.status === 'SUCCESS') {
        if (responseCheck.data.status === 1) {
          return successResponse({
            res,
            message:
              'Your order has been successfully created, please wait a moment for the process.',
            statusCode: 200,
            data: {
              status: 'pending',
              transaction_id: orderRecord.invoice,
            },
          })
        } else {
          // decrease balance
          await updateBalanceUserRestQuery({
            amount: orderRecord.total_price,
            description: 'deposit',
            totalBalance:
              Number(userBalance.balance) - Number(orderRecord.total_price),
            type: '-',
            userId: userRecord.id,
          })

          return successResponse({
            res,
            message: 'Successfully created new order',
            statusCode: 200,
            data: {
              transaction_id: orderRecord.invoice,
              total_price: orderRecord.total_price,
              status: 'success',
              product_detail: {
                variation_key: responseCheck.data.detail.variation_key,
                variation_name: responseCheck.data.detail.variation_name,
                price: orderRecord.total_price,
                customer_data:
                  JSON.parse(orderRecord.data).map((item) => ({
                    [item.key]: item.value,
                  })) || [],
                voucher_code: responseCheck.data.detail.voucher_code,
              },
              history_status: responseCheck.data.history_status,
            },
          })
        }
      } else {
        // refund
        await updateOrderStatusQuery({
          status: 'refund',
          trxId: orderRecord.invoice,
          userId: userRecord.id,
        })

        // return response refund
        return successResponse({
          res,
          message: `Sorry, the product is empty. Order with transaction ID ${trxId} failed to process.`,
          statusCode: 200,
          data: {
            status: 'refund',
            transaction_id: orderRecord.invoice,
          },
        })
      }
    }
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'An error occurred on the server',
      statusCode: 500,
    })
  }
}

const getUserDepositBalance = async (req, res) => {
  try {
    const { authorization } = req.headers
    const userLogin = userAuthorization(authorization)

    const [balanceSelected] = await getUserBalanceDepositQuery(userLogin.id)

    return successResponse({
      res,
      message: 'Berhasil mengambil saldo deposit user',
      statusCode: 200,
      data: {
        balance: balanceSelected.length === 0 ? 0 : balanceSelected[0].balance,
      },
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'An error occurred on the server',
      statusCode: 500,
    })
  }
}

module.exports = {
  createDeposit,
  checkDeposit,
  getUserVariantBrandKey,
  getUserProductRest,
  checkRestOrder,
  createOrderRestApi,
  getRestUserBalance,
  getHistoryDeposit,
  getUserDepositBalance,
}
