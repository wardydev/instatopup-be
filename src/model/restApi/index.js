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

module.exports = {
  createDepositQuery,
  getDepositByTrxIdQuery,
  updateDepositStatusQuery,
}
