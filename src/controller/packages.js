const { successResponse } = require('../helper/http')
const { getPackagesQuery } = require('../model/packages')

const getPackages = async (req, res) => {
  try {
    const [packagesLists] = await getPackagesQuery()
    successResponse({
      res,
      message: 'Berhasil mengambil semua paket',
      statusCode: 200,
      data: packagesLists,
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
  getPackages,
}
