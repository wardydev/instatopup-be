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

const getChartOrderByDayQuery = ({ month, year, userId }) => {
  const SQLQuery = `SELECT DATE(created_at) AS date, 
              COALESCE(SUM(total_price), 0) AS amount
       FROM \`order\`
       WHERE MONTH(created_at) = ? AND YEAR(created_at) = ? AND user_id = ?
       GROUP BY DATE(created_at)`

  return dbPool.execute(SQLQuery, [month, year, userId])
}

const createOrderQuery = ({
  userId,
  productId,
  invoice,
  price,
  data,
  qrCode,
  merchantId,
}) => {
  const SQLQuery =
    'INSERT INTO `order` (user_id, product_id, invoice, quantity, total_price, data, status, qr_code, merchant_id) VALUES (?,?,?,?,?,?,?,?,?)'
  return dbPool.execute(SQLQuery, [
    userId,
    productId,
    invoice,
    1,
    price,
    data,
    'pending',
    qrCode,
    merchantId,
  ])
}

const getOrderByTrxidQuery = (trxId) => {
  const SQLQuery =
    'SELECT user_id, invoice, total_price, data, status, qr_code, merchant_id, brand_key, variation_key FROM `order` WHERE invoice = ?'
  return dbPool.execute(SQLQuery, [trxId])
}

const updateOrderStatusQuery = async ({ userId, status, trxId }) => {
  const SQLQuery =
    'UPDATE `order` SET status = ? WHERE user_id = ? AND invoice = ?'
  return dbPool.execute(SQLQuery, [status, userId, trxId])
}

module.exports = {
  getDashboardChartsQuery,
  getChartOrderByDayQuery,
  createOrderQuery,
  getOrderByTrxidQuery,
  updateOrderStatusQuery,
}
