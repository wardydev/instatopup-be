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

const updateNewDomainQuery = ({ userId, newDomain, websiteId }) => {
  const SQLQuery =
    'UPDATE `user_website` SET domain = ?, status = "paid" WHERE id = ? AND user_id = ?'
  return dbPool.execute(SQLQuery, [newDomain, websiteId, userId])
}

const listUserWebsiteQuery = (userId) => {
  const SQLQuery =
    'SELECT user_website.id, user_website.domain, user_website.status, packages.name, packages.price, packages.period_active FROM user_website JOIN packages ON user_website.package_id = packages.id WHERE user_website.user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const getStatusWebsiteQuery = (userId) => {
  const SQLQuery = 'SELECT status FROM `user_website` WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const getInvoiceQuery = (userId) => {
  const SQLQuery = 'SELECT invoice from transaction WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const getUserSubscription = (userId) => {
  const SQLQuery = 'SELECT package_id FROM user_website WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const getStatusUserWebsiteQuery = (userId) => {
  const SQLQuery = 'SELECT status, domain FROM `user_website` WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

module.exports = {
  getWebsiteByDomainQuery,
  getTransactionByInvoiceQuery,
  updateStatusTrxQuery,
  updateStatusUserWebsiteQuery,
  getDomainByUserIdQuery,
  getPhoneByidQuery,
  updateNewDomainQuery,
  listUserWebsiteQuery,
  getStatusWebsiteQuery,
  getInvoiceQuery,
  getUserSubscription,
  getStatusUserWebsiteQuery,
}
