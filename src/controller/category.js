const { errorResponse, successResponse } = require('../helper/http.js')
const { getCategoryQuery } = require('../model/category')

const getCategories = async (req, res) => {
  try {
    const [categoryLists] = await getCategoryQuery()

    if (categoryLists.length === 0)
      return errorResponse({
        res,
        statusCode: 400,
        message: 'Category tidak ditemukan',
      })

    successResponse({
      res,
      message: 'Berhasil mengambil semua kategori',
      statusCode: 200,
      data: categoryLists,
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
  getCategories,
}
