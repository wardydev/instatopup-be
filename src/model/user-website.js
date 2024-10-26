const dbPool = require('../config/db.js')

const getWebsiteByDomainQuery = (domain) => {
  const SQLQuery = 'SELECT domain FROM `user_website` WHERE domain = ?'
  return dbPool.execute(SQLQuery, [domain])
}

const getDomainByUserIdQuery = (userId) => {
  const SQLQuery = 'SELECT domain FROM `user_website` WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const getPhoneByidQuery = (userId) => {
  const SQLQuery = 'SELECT phone_number FROM `users` WHERE id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const getTransactionByInvoiceQuery = (invoice) => {
  const SQLQuery =
    'SELECT id, user_id, invoice,orderId,status, amount,qr_code, created_at FROM `transaction` WHERE invoice = ?'
  return dbPool.execute(SQLQuery, [invoice])
}

const updateStatusTrxQuery = ({ invoice, status }) => {
  const SQLQuery = 'UPDATE `transaction` SET status = ? WHERE invoice = ?'
  return dbPool.execute(SQLQuery, [status, invoice])
}

const updateStatusUserWebsiteQuery = ({ userId, status }) => {
  const SQLQuery = 'UPDATE `user_website` SET status = ? WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [status, userId])
}

module.exports = {
  getWebsiteByDomainQuery,
  getTransactionByInvoiceQuery,
  updateStatusTrxQuery,
  updateStatusUserWebsiteQuery,
  getDomainByUserIdQuery,
  getPhoneByidQuery,
}
