const dbPool = require('../config/db.js')

const getUserBalanceQuery = (userId) => {
  const SQLQuery =
    'SELECT balance FROM `user_balance` WHERE user_id = ? AND description = ? ORDER BY created_at DESC LIMIT 1;'
  return dbPool.execute(SQLQuery, [userId, 'purchase'])
}

const updateBalanceUserQuery = ({
  userId,
  totalBalance,
  amount,
  description,
  type = '+',
}) => {
  const SQLQuery =
    'INSERT INTO `user_balance` (user_id, balance, transaction_amount, transaction_type, description) VALUES (?, ?, ?, ?, ?)'
  return dbPool.execute(SQLQuery, [
    userId,
    totalBalance,
    amount,
    type,
    description,
  ])
}

const updateBalanceUserRestQuery = ({
  userId,
  totalBalance,
  amount,
  description,
  type,
}) => {
  const SQLQuery =
    'INSERT INTO `user_balance` (user_id, balance, transaction_amount, transaction_type, description) VALUES (?, ?, ?, ?, ?)'
  return dbPool.execute(SQLQuery, [
    userId,
    totalBalance,
    amount,
    type,
    description,
  ])
}

const getUserBalanceDepositQuery = (userId) => {
  const SQLQuery =
    'SELECT balance FROM `user_balance` WHERE user_id = ? AND description = ?'
  return dbPool.execute(SQLQuery, [userId, 'deposit'])
}

module.exports = {
  getUserBalanceQuery,
  updateBalanceUserQuery,
  getUserBalanceDepositQuery,
  updateBalanceUserRestQuery,
}
