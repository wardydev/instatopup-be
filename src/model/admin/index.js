const dbPool = require('../../config/db.js')

const changeStatusUserWebsiteQuery = ({ userId, websiteId, status }) => {
  const SQLQuery =
    'UPDATE `user_website` SET status = ? WHERE user_id = ? AND id = ?'
  return dbPool.execute(SQLQuery, [status, userId, websiteId])
}

const createDefaultUserBalanceQuery = (userId) => {
  const SQLQuery =
    'INSERT INTO `user_balance` (user_id, balance, transaction_amount, transaction_type, description) VALUES (?, ?,?,?,?)'
  return dbPool.execute(SQLQuery, [userId, 0, 0, '+', 'purchase'])
}

const listUserWebsiteQuery = ({ limit, offset, q }) => {
  if (q) {
    const SQLQuery = `SELECT * FROM user_website WHERE domain LIKE '%${q}%'`
    return dbPool.execute(SQLQuery)
  } else {
    const SQLQuery = `SELECT * FROM user_website ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    return dbPool.execute(SQLQuery)
  }
}

const getTotalWebsiteQuery = () => {
  const SQLQuery = 'SELECT COUNT(*) as total FROM `user_website`'
  return dbPool.execute(SQLQuery)
}

const approveSettlementRequestQuery = ({ status, userId, withdrawalId }) => {
  const SQLQuery =
    'UPDATE `withdrawal` SET status = ? WHERE user_id =? AND id = ?'
  return dbPool.execute(SQLQuery, [status, userId, withdrawalId])
}

const getWithdrawalListsQuery = ({ limit, offset }) => {
  const SQLQuery = `SELECT * FROM withdrawal ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
  return dbPool.execute(SQLQuery)
}

const getTotalWithdrawalListsQuery = () => {
  const SQLQuery = 'SELECT COUNT(*) as total FROM `withdrawal`'
  return dbPool.execute(SQLQuery)
}

const getTotalTransactionQuery = () => {
  const SQLQuery =
    "SELECT SUM(amount) AS total_amount FROM `transaction` WHERE status = 'success'"
  return dbPool.execute(SQLQuery)
}

module.exports = {
  changeStatusUserWebsiteQuery,
  createDefaultUserBalanceQuery,
  listUserWebsiteQuery,
  approveSettlementRequestQuery,
  getWithdrawalListsQuery,
  getTotalTransactionQuery,
  getTotalWithdrawalListsQuery,
  getTotalWebsiteQuery,
}
