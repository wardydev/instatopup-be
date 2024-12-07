const {
  createSignatureVCGamer,
  userAuthorization,
} = require('../helper/functions')
const {
  errorResponse,
  successResponse,
  httpVcGamer,
} = require('../helper/http')
const {
  getProductsQuery,
  getProductByBrandKeyQuery,
  getProfitQuery,
  userProductQuery,
  createProductPriceQuery,
  updateUserProductQuery,
  deleteUserProductPriceQuery,
  getProductsLandingQuery,
} = require('../model/products')
const { getUserIdByTokenQuery } = require('../model/user')
const {
  getUserProductHideQuery,
  hideProductByUserQuery,
  showProductByUserQuery,
} = require('../model/userProduct')

const getProducts = async (req, res) => {
  try {
    const { q } = req.query
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const [productSelected] = await getProductsQuery(q)
    const [userProductSelected] = await getUserProductHideQuery(token)

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

const getLandingProduct = async (req, res) => {
  try {
    const { q } = req.query
    const [productSelected] = await getProductsLandingQuery()

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

const getVariantLandingBrandKey = async (req, res) => {
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

    successResponse({
      res,
      message: 'Berhasil mengambil semua data',
      statusCode: 200,
      data: response?.data,
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

const getUserProducts = async (req, res) => {
  try {
    const { q } = req.query

    const [productSelected] = await getProductsQuery(q)

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
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

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

    const [userProductSelected] = await userProductQuery(token)
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

    console.log(productByBrandKey)

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

const getVariantBrandKeyUser = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const userLogin = userAuthorization(authHeader)
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

const createUserProductPrice = async () => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const { key, variationName, brandName, price } = req.body
    const { brand_key } = req.params

    if (!key || !variationName || !brandName || !price || !brand_key)
      return errorResponse({
        res,
        message: 'Form wajib diisi',
        statusCode: 400,
      })

    const paramsSignature =
      `${process.env.VCGAMERS_SECRET}` + 'variation' + brand_key
    const signature = createSignatureVCGamer(paramsSignature)
    const URL_VARIATION = `${process.env.VCGAMERS_URL_V2}/variations?sign=${signature}&brand_key=${brand_key}`
    const response = await httpVcGamer(URL_VARIATION)

    const [productSelected] = response?.data.filter((item) => item.key === key)

    if (price < productSelected.price)
      return errorResponse({
        res,
        message: 'Harga tidak sesuai',
        statusCode: 400,
      })

    await createProductPriceQuery({
      brandName,
      key,
      price,
      userId: token,
      variationName,
      brandKey: brand_key,
    })

    successResponse({
      res,
      message: 'Berhasil Membuat harga produk baru',
      statusCode: 200,
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

const updateUserProductPrice = async () => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const { price, productId } = req.body

    if (!price || !productId)
      return errorResponse({
        res,
        message: 'Form wajib diisi',
        statusCode: 400,
      })

    await updateUserProductQuery({
      price,
      productId,
      userId: token,
    })

    successResponse({
      res,
      message: 'Berhasil mengupdate harga produk',
      statusCode: 200,
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

const deleteUserProductPrice = async () => {
  try {
    const { id } = req.params
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!id)
      return errorResponse({
        res,
        message: 'id tidak ditemukan',
        statusCode: 400,
      })

    await deleteUserProductPriceQuery({ productId: id, userId: token })

    successResponse({
      res,
      message: 'Berhasil menghapus harga produk',
      statusCode: 200,
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

const hideUserProduct = async (req, res) => {
  try {
    const { productId, brandKey } = req.body
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!productId || !brandKey)
      return errorResponse({
        res,
        message: 'Produk tidak ditemukan',
        statusCode: 400,
      })

    await hideProductByUserQuery({
      brandKey,
      productId,
      userKey: token,
    })

    successResponse({
      res,
      message: 'Berhasil mennyembunyikan produk',
      statusCode: 200,
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

const showUserProduct = async (req, res) => {
  try {
    const { productId, brandKey } = req.params
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!productId || !brandKey)
      return errorResponse({
        res,
        message: 'Produk tidak ditemukan',
        statusCode: 400,
      })

    await showProductByUserQuery({
      brandKey,
      productId,
      userKey: token,
    })
    successResponse({
      res,
      message: 'Berhasil menampilkan produk',
      statusCode: 200,
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
  createUserProductPrice,
  updateUserProductPrice,
  deleteUserProductPrice,
  getVariantBrandKeyUser,
  hideUserProduct,
  showUserProduct,
  getUserProducts,
  getLandingProduct,
  getVariantLandingBrandKey,
}
