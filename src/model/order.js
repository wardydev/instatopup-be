const dbPool = require('../config/db.js')

const getDashboardChartsQuery = ({ month, year, userId }) => {
  const SQLQuery = `
        SELECT 
            SUM(total_price) AS total_pendapatan,
            SUM(CASE WHEN MONTH(created_at) = ? AND YEAR(created_at) = ? THEN total_price ELSE 0 END) AS total_pendapatan_bulan_ini,
            SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total_price ELSE 0 END) AS total_pendapatan_hari_ini,
            SUM(CASE WHEN DATE(created_at) = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY) THEN total_price ELSE 0 END) AS total_pendapatan_kemarin
        FROM \`order\` WHERE user_id = ? AND status = ?
    `
  return dbPool.execute(SQLQuery, [month, year, userId, "success"])
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
  brandKey,
  variationKey,
  phoneNumber,
}) => {
  const SQLQuery =
    'INSERT INTO `order` (user_id, product_id, invoice, quantity, total_price, data, status, qr_code, merchant_id, brand_key, variation_key, customer_number) VALUES (?,?,?,?,?,?,?,?,?,?,?, ?)'
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
    brandKey,
    variationKey,
    phoneNumber,
  ])
}

const getOrderByUserTrxidQuery = (trxId, userId) => {
  const SQLQuery =
    'SELECT id, product_id, user_id, invoice, total_price, data, status, qr_code, merchant_id, brand_key, variation_key, trx_id, quantity, created_at, customer_number FROM `order` WHERE invoice = ? AND user_id = ?'
  return dbPool.execute(SQLQuery, [trxId, userId])
}

const getOrderByTrxidQuery = ({ trxId, status }) => {
  const SQLQuery =
    'SELECT id, product_id, user_id, invoice, total_price, data, status, qr_code, merchant_id, brand_key, variation_key, trx_id, quantity, created_at, customer_number FROM `order` WHERE invoice = ? AND status = ?'
  return dbPool.execute(SQLQuery, [trxId, status])
}

const getHistoryOrderQuery = ({ userId, invoice }) => {
  if (invoice) {
    const SQLQuery =
      'SELECT invoice, brand_key, data, created_at, total_price, status, customer_number FROM `order` WHERE invoice = ? AND user_id = ?'
    return dbPool.execute(SQLQuery, [invoice, userId])
  } else {
    const SQLQuery =
      'SELECT invoice, brand_key, data, created_at, total_price, status, customer_number FROM `order` WHERE user_id = ? ORDER BY created_at DESC LIMIT 10 '
    return dbPool.execute(SQLQuery, [userId])
  }
}

const updateOrderStatusQuery = async ({ userId, status, trxId }) => {
  const SQLQuery =
    'UPDATE `order` SET status = ? WHERE user_id = ? AND invoice = ?'
  return dbPool.execute(SQLQuery, [status, userId, trxId])
}

const updateTrxIdQuery = ({ userId, invoice, trxId }) => {
  const SQLQuery =
    'UPDATE `order` SET trx_id = ? WHERE user_id = ? AND invoice = ?'
  return dbPool.execute(SQLQuery, [trxId, userId, invoice])
}

const createOrderRestQuery = ({
  userId,
  productId,
  invoice,
  price,
  data,
  qrCode,
  merchantId,
  brandKey,
  variationKey,
  status,
}) => {
  const SQLQuery =
    'INSERT INTO `order` (user_id, product_id, invoice, quantity, total_price, data, status, qr_code, merchant_id, brand_key, variation_key) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  return dbPool.execute(SQLQuery, [
    userId,
    productId,
    invoice,
    1,
    price,
    data,
    status,
    qrCode,
    merchantId,
    brandKey,
    variationKey,
  ])
}

const getOrderUserQuery = ({apiKey, invoice}) => {
  const SQLQuery = "SELECT users.id, users.email, user_website.domain, users.full_name, users.phone_number, users.api_key, sewatopup.order.brand_key, sewatopup.order.qr_code, sewatopup.order.trx_id, sewatopup.order.merchant_id, sewatopup.order.status, sewatopup.order.invoice, sewatopup.order.total_price, sewatopup.product.image_url, sewatopup.order.variation_key,  product.name, product.id AS product_id, sewatopup.order.data, sewatopup.order.created_at FROM `users` join sewatopup.order ON users.id = sewatopup.order.user_id JOIN product ON sewatopup.order.product_id = product.id JOIN user_website ON users.id = user_website.user_id WHERE users.api_key = ? AND sewatopup.order.invoice = ?"
  return dbPool.execute(SQLQuery, [apiKey, invoice])
}

module.exports = {
  getDashboardChartsQuery,
  getChartOrderByDayQuery,
  createOrderQuery,
  getOrderByTrxidQuery,
  updateOrderStatusQuery,
  updateTrxIdQuery,
  getHistoryOrderQuery,
  getOrderByUserTrxidQuery,
  createOrderRestQuery,
  getOrderUserQuery
}
