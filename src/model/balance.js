const dbPool = require('../config/db.js')

const getUserBalanceQuery = (userId) => {
  const SQLQuery = 'SELECT balance FROM `user_balance` WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const updateBalanceUserQuery = ({
  userId,
  totalBalance,
  amount,
  description,
}) => {
  const SQLQuery =
    'INSERT INTO `user_balance` (user_id, balance, transaction_amount, transaction_type, description) VALUES (?, ?, ?, ?, ?)'
  return dbPool.execute(SQLQuery, [
    userId,
    totalBalance,
    amount,
    '+',
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
