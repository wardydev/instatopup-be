const {
  createSignatureVCGamer,
  userAuthorization,
} = require('../helper/functions')
const {
  errorResponse,
  successResponse,
  httpVcGamer,
} = require('../helper/http')
const { getUserIdByTokenQuery } = require('../model/user')
const {
  createUserProductQuery,
  updateUserProductQuery,
  resetUserProductQuery,
  hideProductByUserQuery,
  showProductByUserQuery,
} = require('../model/userProduct')

const createUserProductPrice = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const userLogin = userAuthorization(authHeader)
    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    const { brand_key } = req.params
    const { itemKey, name, brandName, price } = req.body

    if (!brand_key || !itemKey || !name || !brandName)
      return errorResponse({
        res,
        message: 'Produk tidak ditemukan',
        statusCode: 400,
      })

    if (!price)
      return errorResponse({
        res,
        message: 'Harga tidak ditemukan',
        statusCode: 400,
      })

    const paramsSignature =
      `${process.env.VCGAMERS_SECRET}` + 'variation' + brand_key
    const signature = createSignatureVCGamer(paramsSignature)
    const URL_VARIATION = `${process.env.VCGAMERS_URL_V2}/variations?sign=${signature}&brand_key=${brand_key}`
    const response = await httpVcGamer(URL_VARIATION)

    const [productSelected] = response?.data.filter(
      (item) => item.key === itemKey
    )

    if (price < productSelected.price)
      return errorResponse({
        res,
        message: 'Harga tidak boleh lebih kecil dari harga default',
        statusCode: 400,
      })

    await createUserProductQuery({
      brandKey: brand_key,
      brandName,
      itemKey,
      name,
      price,
      userKey: userSelected[0].api_key,
    })

    successResponse({
      res,
      message: 'Berhasil membuat harga produk baru',
      statusCode: 200,
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const updateUserProductPrice = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const userLogin = userAuthorization(authHeader)
    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    const { brand_key, itemKey } = req.params
    const { price } = req.body

    if (!itemKey)
      return errorResponse({
        res,
        message: 'Produk tidak ditemukan',
        statusCode: 400,
      })
    if (!price)
      return errorResponse({
        res,
        message: 'Harga tidak boleh kosong',
        statusCode: 400,
      })

    const paramsSignature =
      `${process.env.VCGAMERS_SECRET}` + 'variation' + brand_key
    const signature = createSignatureVCGamer(paramsSignature)
    const URL_VARIATION = `${process.env.VCGAMERS_URL_V2}/variations?sign=${signature}&brand_key=${brand_key}`
    const response = await httpVcGamer(URL_VARIATION)

    const [productSelected] = response?.data.filter(
      (item) => item.key === itemKey
    )

    if (price < productSelected.price)
      return errorResponse({
        res,
        message: 'Harga tidak boleh lebih kecil dari harga default',
        statusCode: 400,
      })

    await updateUserProductQuery({
      itemKey,
      price,
      userKey: userSelected[0].api_key,
    })

    successResponse({
      res,
      message: 'Berhasil memperbarui harga produk baru',
      statusCode: 200,
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const resetUserProductPrice = async (req, res) => {
  try {
    const { itemKey } = req.params
    const authHeader = req.headers['authorization']
    const userLogin = userAuthorization(authHeader)
    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    if (!itemKey)
      return errorResponse({
        res,
        message: 'Item tidak ditemukan',
        statusCode: 400,
      })

    await resetUserProductQuery({
      itemKey,
      userKey: userSelected[0].api_key,
    })

    successResponse({
      res,
      message: 'Berhasil reset harga product',
      statusCode: 200,
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const hideUserProduct = async (req, res) => {
  try {
    const { productId, brandKey } = req.body
    const authHeader = req.headers['authorization']
    const userLogin = userAuthorization(authHeader)
    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    if (!productId || !brandKey)
      return errorResponse({
        res,
        message: 'Produk tidak ditemukan',
        statusCode: 400,
      })

    await hideProductByUserQuery({
      brandKey,
      productId,
      userKey: userSelected[0].api_key,
    })

    successResponse({
      res,
      message: 'Berhasil sembunyikan produk',
      statusCode: 200,
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const showUserProduct = async (req, res) => {
  try {
    const { productId, brandKey } = req.params
    const authHeader = req.headers['authorization']
    const userLogin = userAuthorization(authHeader)
    const [userSelected] = await getUserIdByTokenQuery(userLogin.id)

    if (!productId || !brandKey)
      return errorResponse({
        res,
        message: 'Produk tidak ditemukan',
        statusCode: 400,
      })

    await showProductByUserQuery({
      brandKey,
      productId,
      userKey: userSelected[0].api_key,
    })

    successResponse({
      res,
      message: 'Berhasil menampilkan produk',
      statusCode: 200,
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

module.exports = {
  createUserProductPrice,
  updateUserProductPrice,
  resetUserProductPrice,
  hideUserProduct,
  showUserProduct,
}
