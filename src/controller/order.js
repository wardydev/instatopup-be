const {
  getIndonesianDayName,
  getYesterdayIndonesianDayName,
  calculatePercentageIncrease,
} = require('../helper/formatted')
const { userAuthorization } = require('../helper/functions')
const { errorResponse, successResponse } = require('../helper/http')
const {
  getDashboardChartsQuery,
  getChartOrderByDayQuery,
} = require('../model/order')

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

    const daysInMonth = new Date(year, month, 0).getDate()
    const incomeByDay = []

    const [transacationChartsDay] = await getChartOrderByDayQuery({
      month,
      year,
      userId: userLogin.id,
    })

    console.log(transacationChartsDay, 'CHARTS')

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`

      const transaction = transacationChartsDay.find((t) => {
        const transactionDate = new Date(t.date).toISOString().split('T')[0]
        return transactionDate === date
      })

      incomeByDay.push({
        date,
        amount: transaction ? transaction.amount : 0,
      })
    }

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
      charts: incomeByDay,
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
