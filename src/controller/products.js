const { errorResponse, successResponse } = require('../helper/http')
const { getProductsQuery } = require('../model/products')

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

module.exports = {
  getProducts,
}
