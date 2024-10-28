const dbPool = require('../config/db.js')

const listWithdrawalQuery = (userId) => {
  const SQLQuery =
    'SELECT withdrawal.created_at, withdrawal.id, withdrawal.amount, user_bank_accounts.bank_name, user_bank_accounts.account_number, user_bank_accounts.account_name FROM withdrawal JOIN user_bank_accounts ON withdrawal.bank_id = user_bank_accounts.id WHERE withdrawal.user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const createRequestWithdrawalQuery = ({ userId, bankId, amount }) => {
  const SQLQuery =
    'INSERT INTO `withdrawal` (user_id, bank_id, amount, status) VALUES (?, ?, ?, ?)'
  return dbPool.execute(SQLQuery, [userId, bankId, amount, 'settlement'])
}

const getTotalBalanceQuery = (userId) => {
  const SQLQuery = 'SELECT balance FROM `user_balance` WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

module.exports = {
  listWithdrawalQuery,
  createRequestWithdrawalQuery,
  getTotalBalanceQuery,
}
