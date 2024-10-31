const dbPool = require('../config/db.js')

const getUserBalanceQuery = (userId) => {
  const SQLQuery = 'SELECT balance FROM `user_balance` WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

module.exports = { getUserBalanceQuery }
