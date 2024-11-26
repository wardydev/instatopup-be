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
} = require('../../helper/http')
const {
  updateBalanceUserQuery,
  getUserBalanceQuery,
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
} = require('../../model/restApi')
const { getUserIdByTokenQuery } = require('../../model/user')
const { getUserProductHideQuery } = require('../../model/userProduct')

const createDeposit = async (req, res) => {
  try {
    const { amount } = req.body
    const { authorization } = req.headers

    if (!amount)
      return errorResponse({
        res,
        message: 'Jumlah deposit tidak ditemukan',
        statusCode: 404,
      })

    const userLogin = userAuthorization(authorization)
    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

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

    console.log(responseTransaction, 'RESPONSE TRANSACTION')

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
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const checkDeposit = async (req, res) => {
  try {
    const { trxId } = req.query

    if (!trxId)
      return errorResponse({
        res,
        message: 'Id transaksi tidak ditemukan',
        statusCode: 404,
      })

    const { authorization } = req.headers
    const userLogin = userAuthorization(authorization)
    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    const [userDepositSelected] = await getDepositByTrxIdQuery({
      trxId: trxId,
      userId: userSelected[0].id,
    })

    if (userDepositSelected.length === 0)
      return errorResponse({
        res,
        message: `Deposit dengan id transaksi ${trxId} tidak ditemukan`,
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

    console.log(checkResponse, 'CHECK RESPONSE')

    if (checkResponse?.statusCode === '00') {
      const [balanceSelected] = await getUserBalanceQuery(userSelected[0].id)

      await updateBalanceUserQuery({
        amount: userDepositSelected[0].amount,
        description: 'deposit',
        totalBalance:
          Number(userDepositSelected[0].amount) +
          Number(balanceSelected[0].balance),
        userId: userSelected[0].id,
      })
      await updateDepositStatusQuery({
        status: 'success',
        trxId: userDepositSelected[0].trx_id,
        userId: userSelected[0].id,
      })

      return successResponse({
        res,
        message:
          'Sedang menunggu pembayaran, Silahkan selesaikan pembayaran Kamu',
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
        message: 'Pembayaran Expired',
        statusCode: 200,
      })
    } else {
      return successResponse({
        res,
        message:
          'Sedang menunggu pembayaran, Silahkan selesaikan pembayaran Kamu',
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
  } catch (err) {}
}

const getUserVariantBrandKey = async (req, res) => {
  try {
    const { authorization } = req.headers
    const userLogin = userAuthorization(authorization)

    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

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
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const getUserProductRest = async (req, res) => {
  try {
    const { authorization } = req.headers
    const userLogin = userAuthorization(authorization)

    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

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
      message: 'Terjadi Kesalahan di server',
      statusCode: 500,
    })
  }
}

module.exports = {
  createDeposit,
  checkDeposit,
  getUserVariantBrandKey,
  getUserProductRest,
}
