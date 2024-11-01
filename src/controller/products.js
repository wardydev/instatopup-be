const { createSignatureVCGamer } = require('../helper/functions')
const {
  errorResponse,
  successResponse,
  httpVcGamer,
} = require('../helper/http')
const {
  getProductsQuery,
  getProductByBrandKeyQuery,
  getProfitQuery,
} = require('../model/products')

const getProducts = async (req, res) => {
  try {
    const [productSelected] = await getProductsQuery()
    successResponse({
      res,
      message: 'Berhasil mengambil semua produk',
      statusCode: 200,
      data: productSelected,
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

const getVariantBrandKey = async (req, res) => {
  try {
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

    const [profitSelected] = await getProfitQuery()

    const [productByBrandKey] = await getProductByBrandKeyQuery(brand_key)
    successResponse({
      res,
      message: 'Berhasil mengambil semua data',
      statusCode: 200,
      data: {
        items: response.data.map((item) => {
          const calculatedPrice =
            item.price + item.price * Number(profitSelected[0].profit)
          return {
            ...item,
            price: calculatedPrice,
          }
        }),
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

module.exports = {
  getProducts,
  getVariantBrandKey,
}
