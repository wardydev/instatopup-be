const { successResponse, errorResponse } = require('../helper/http')
const {
  getFlashSalesQuery,
  createNewFlashSalesQuery,
  updateFlashSalesQuery,
  deleteFlashSalesQuery,
  updateStatusFlashSaleQuery,
} = require('../model/flashSales')

const getFlashSales = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const [flashSalesLists] = await getFlashSalesQuery(token)

    const updatedData = flashSalesLists.map((item) => {
      const discountPrice =
        (Number(item.discount_rate) * Number(item.price)) / 100
      return {
        ...item,
        discountPrice: Number(item.price) - discountPrice,
      }
    })

    successResponse({
      res,
      message: 'Berhasil mengambil semua data flash sale',
      data: updatedData,
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

const createNewFlashSales = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const {
      discount,
      itemKey,
      variation,
      brandName,
      productCode,
      startTime,
      endTime,
      price,
      imageUrl,
      forms,
    } = req.body

    if (
      !discount ||
      !itemKey ||
      !variation ||
      !brandName ||
      !productCode ||
      !startTime ||
      !endTime ||
      !price ||
      !imageUrl
    )
      return errorResponse({
        res,
        message: 'Semua form wajib diisi',
        statusCode: 400,
      })

    await createNewFlashSalesQuery({
      brandName,
      discount,
      endTime,
      itemKey,
      productCode,
      startTime,
      userId: token,
      variation,
      price,
      imageUrl,
      forms: JSON.stringify(forms),
    })

    successResponse({
      res,
      message: 'Berhasil membuat produk flash sale baru',
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

const updateFlashSales = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const {
      discount,
      itemKey,
      variation,
      brandName,
      productCode,
      startTime,
      endTime,
      price,
    } = req.body
    const { flashSaleId } = req.params

    if (
      !discount ||
      !itemKey ||
      !variation ||
      !brandName ||
      !productCode ||
      !startTime ||
      !endTime ||
      !price ||
      !flashSaleId
    )
      return errorResponse({
        res,
        message: 'Semua form wajib diisi',
        statusCode: 400,
      })

    await updateFlashSalesQuery({
      brandName,
      discount,
      endTime,
      flashSaleId: flashSaleId,
      itemKey,
      productCode,
      startTime,
      userId: token,
      variation,
    })

    successResponse({
      res,
      message: 'Berhasil mengedit produk flash sale',
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

const deleteFlashSales = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const { flashSaleId } = req.params

    if (!flashSaleId)
      return errorResponse({
        res,
        message: 'Produk Flash Sale tidak ditemukan',
        statusCode: 400,
      })

    await deleteFlashSalesQuery({
      flashSaleId,
      userId: token,
    })

    successResponse({
      res,
      message: 'Berhasil menghapus produk flash sale',
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
const updateStatusFlashSales = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const { status } = req.body
    const { flashSaleId } = req.params

    if (!flashSaleId || !status)
      return errorResponse({
        res,
        message: 'Semua form wajib diisi',
        statusCode: 400,
      })

    await updateStatusFlashSaleQuery({
      flashSaleId,
      status,
      userId: token,
    })

    return successResponse({
      res,
      message: 'Berhasil mengupdate status produk flash sale',
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

// console.log(err)
//     errorResponse({
//       res,
//       message: 'Terjadi kesalahan di server',
//       statusCode: 500,
//     })

module.exports = {
  createNewFlashSales,
  getFlashSales,
  updateFlashSales,
  deleteFlashSales,
  updateStatusFlashSales,
}
