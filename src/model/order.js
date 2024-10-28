const dbPool = require('../config/db.js')

const getDashboardChartsQuery = ({ month, year, userId }) => {
  const SQLQuery = `
        SELECT 
            SUM(total_price) AS total_pendapatan,
            SUM(CASE WHEN MONTH(created_at) = ? AND YEAR(created_at) = ? THEN total_price ELSE 0 END) AS total_pendapatan_bulan_ini,
            SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total_price ELSE 0 END) AS total_pendapatan_hari_ini,
            SUM(CASE WHEN DATE(created_at) = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY) THEN total_price ELSE 0 END) AS total_pendapatan_kemarin
        FROM \`order\` WHERE user_id = ?
    `
  return dbPool.execute(SQLQuery, [month, year, userId])
}

module.exports = {
  getDashboardChartsQuery,
}
