const {
  getIndonesianDayName,
  getYesterdayIndonesianDayName,
  calculatePercentageIncrease,
} = require('../helper/formatted')
const { userAuthorization } = require('../helper/functions')
const { errorResponse, successResponse } = require('../helper/http')
const { getDashboardChartsQuery } = require('../model/order')

const getDashboardChart = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)
    const month = req.query.month || new Date().getMonth() + 1
    const year = req.query.year || new Date().getFullYear()

    const [dataDashboard] = await getDashboardChartsQuery({
      month,
      year,
      userId: userLogin.id,
    })

    const chartResponse = {
      income: dataDashboard[0].total_pendapatan,
      incomeMonth: dataDashboard[0].total_pendapatan_bulan_ini,
      incomeToday: dataDashboard[0].total_pendapatan_hari_ini,
      incomeYesterday: dataDashboard[0].total_pendapatan_kemarin,
      today: getIndonesianDayName(new Date()),
      yesterday: getYesterdayIndonesianDayName(),
      percentageDay:
        Math.floor(
          calculatePercentageIncrease(
            Number(dataDashboard[0].total_pendapatan_kemarin),
            Number(dataDashboard[0].total_pendapatan_hari_ini)
          )
        ) + '%',
    }

    successResponse({
      res,
      message: 'Berhasil mengambil data chart dashboard',
      statusCode: 200,
      data: chartResponse,
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
  getDashboardChart,
}
