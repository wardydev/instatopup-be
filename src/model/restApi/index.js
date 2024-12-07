const dbPool = require('../../config/db.js')

const createDepositQuery = ({
  userId,
  amount,
  status,
  qrCode,
  trxCode,
  merchantId,
}) => {
  const SQLQuery =
    'INSERT INTO `deposit` (user_id, amount, status, payment_method, qr_code, trx_id, merchant_id) VALUES (?,?,?,?,?,?,?)'
  return dbPool.execute(SQLQuery, [
    userId,
    amount,
    status,
    'qris',
    qrCode,
    trxCode,
    merchantId,
  ])
}

const getDepositByTrxIdQuery = ({ trxId, userId }) => {
  const SQLQuery = 'SELECT * FROM `deposit` WHERE trx_id = ? AND user_id = ?'
  return dbPool.execute(SQLQuery, [trxId, userId])
}

const updateDepositStatusQuery = ({ status, trxId, userId }) => {
  const SQLQuery =
    'UPDATE `deposit` SET status = ? WHERE trx_id = ? AND user_id = ?'
  return dbPool.execute(SQLQuery, [status, trxId, userId])
}

const historyDepositListsQuery = ({ userId, offset, limit }) => {
  const SQLQuery = `SELECT amount, status, payment_method, created_at FROM deposit WHERE user_id = ? AND status = ? ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset} `
  return dbPool.execute(SQLQuery, [userId, 'success'])
}

const getTotalDepositHistoryQuery = (userId) => {
  const SQLQuery = `SELECT COUNT(*) as total FROM deposit WHERE user_id = ? AND status = ?`
  return dbPool.execute(SQLQuery, [userId, 'success'])
}

module.exports = {
  createDepositQuery,
  getDepositByTrxIdQuery,
  updateDepositStatusQuery,
  historyDepositListsQuery,
  getTotalDepositHistoryQuery,
}
