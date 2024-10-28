const dbPool = require('../config/db.js')

const getBankQuery = (userId) => {
  const SQLQuery = 'SELECT * FROM `user_bank_accounts` WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const ceateBankQuery = ({ bankName, norek, accountName, userId }) => {
  const SQLQuery =
    'INSERT INTO `user_bank_accounts` (user_id, bank_name, account_number, account_name) VALUES (?, ?, ?, ?)'
  return dbPool.execute(SQLQuery, [userId, bankName, norek, accountName])
}

const updateBankQuery = ({ bankId, bankName, norek, accountName, userId }) => {
  const SQLQuery =
    'UPDATE `user_bank_accounts` SET bank_name = ?, account_number = ?, account_name = ? WHERE id = ? AND user_id = ?'
  return dbPool.execute(SQLQuery, [
    bankName,
    norek,
    accountName,
    bankId,
    userId,
  ])
}

const deleteBankQuery = ({ bankId, userId }) => {
  const SQLQuery = 'DELETE FROM user_bank_accounts WHERE id =? AND user_id = ?'
  return dbPool.execute(SQLQuery, [bankId, userId])
}

module.exports = {
  getBankQuery,
  ceateBankQuery,
  updateBankQuery,
  deleteBankQuery,
}
