const { errorResponse, successResponse } = require('../../helper/http')
const {
  changeStatusUserWebsiteQuery,
  createDefaultUserBalanceQuery,
  listUserWebsiteQuery,
  getWithdrawalListsQuery,
  approveSettlementRequestQuery,
  getTotalTransactionQuery,
  getTotalWithdrawalListsQuery,
  getTotalWebsiteQuery,
} = require('../../model/admin')

const activateUserWebsite = async (req, res) => {
  try {
    const { userId, websiteId } = req.body

    if (!userId || !websiteId)
      return errorResponse({
        res,
        message: 'ID User dan id website tidak ditemukan',
        statusCode: 400,
      })

    await changeStatusUserWebsiteQuery({
      status: 'success',
      userId,
      websiteId,
    })

    successResponse({
      res,
      message: 'Berhasil aktivasi website user',
      statusCode: 200,
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

const listUserWebsite = async (req, res) => {
  try {
    const q = req.query.q
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const [userWebsiteLists] = await listUserWebsiteQuery({ limit, offset, q })
    const [[{ total }]] = await getTotalWebsiteQuery()

    const totalPages = Math.ceil(total / limit)

    successResponse({
      res,
      message: 'Berhasil aktivasi website user',
      statusCode: 200,
      data: userWebsiteLists,
      meta: {
        page,
        limit,
        totalRecords: total,
        totalPages,
      },
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

const getListsWithdrwal = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const [withdrawalSelected] = await getWithdrawalListsQuery({
      limit,
      offset,
    })
    const [[{ total }]] = await getTotalWithdrawalListsQuery()

    const totalPages = Math.ceil(total / limit)

    successResponse({
      res,
      message: 'Berhasil mengambil data withdrawal',
      statusCode: 200,
      data: withdrawalSelected,
      meta: {
        page,
        limit,
        totalRecords: total,
        totalPages,
      },
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

const approveRequestSettlement = async (req, res) => {
  try {
    const { userId, withdrawalId, status } = req.body

    if (!userId)
      return errorResponse({
        res,
        message: 'ID User tidak ditemukan',
        statusCode: 400,
      })
    if (!withdrawalId)
      return errorResponse({
        res,
        message: 'ID Withdrawal tidak ditemukan',
        statusCode: 400,
      })
    if (!status)
      return errorResponse({
        res,
        message: 'Status kosong',
        statusCode: 400,
      })

    await approveSettlementRequestQuery({
      status,
      userId,
      withdrawalId,
    })

    successResponse({
      res,
      message: 'Withdrwal telah diterima',
      statusCode: 200,
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

const getTotalSummarizedQuery = async (req, res) => {
  try {
    const [totalSummarized] = await getTotalTransactionQuery()
    successResponse({
      res,
      message: 'Withdrawal telah diterima',
      statusCode: 200,
      data: {
        total_ammount: totalSummarized[0].total_amount,
      },
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
  activateUserWebsite,
  listUserWebsite,
  getListsWithdrwal,
  approveRequestSettlement,
  getTotalSummarizedQuery,
}
