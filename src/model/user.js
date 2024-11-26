const dbPool = require('../config/db.js')

const createUserQuery = ({
  userId,
  email,
  fullName,
  phoneNumber,
  password,
  apiKey,
}) => {
  const SQLQuery =
    'INSERT INTO `users` (id, email, full_name, phone_number, password, api_key) VALUES (?, ?, ?, ?, ?, ?)'
  return dbPool.execute(SQLQuery, [
    userId,
    email,
    fullName,
    phoneNumber,
    password,
    apiKey,
  ])
}

const createUserWebsiteQuery = ({ userId, packageId, domain }) => {
  const SQLQuery =
    'INSERT INTO `user_website` (user_id, package_id, domain) VALUES (?, ?, ?)'
  return dbPool.execute(SQLQuery, [userId, packageId, domain])
}

const createTransactionQuery = ({
  userId,
  packageId,
  invoice,
  orderId,
  qrCode,
  amount,
}) => {
  const SQLQuery =
    'INSERT INTO `transaction` (user_id, package_id, invoice,orderId, qr_code, amount, status) VALUES (?,?,?,?,?,?,?)'
  return dbPool.execute(SQLQuery, [
    userId,
    packageId,
    invoice,
    orderId,
    qrCode,
    amount,
    'pending',
  ])
}

const getUserByEmailQuery = (email) => {
  const SQLQuery =
    'SELECT email, full_name, phone_number, password FROM `users` WHERE email = ?'
  return dbPool.execute(SQLQuery, [email])
}

const getUserByPhoneQuery = (phone) => {
  const SQLQuery =
    'SELECT id, email, full_name, phone_number FROM `users` WHERE phone_number = ?'
  return dbPool.execute(SQLQuery, [phone])
}

const getUserIdByTokenQuery = (id) => {
  const SQLQuery =
    'SELECT id, api_key, full_name, email, phone_number FROM `users` WHERE id = ?'
  return dbPool.execute(SQLQuery, [id])
}

const resetOtpQuery = ({ email, phoneNumber }) => {
  const SQLQuery = 'DELETE FROM `user_otp` WHERE email = ? AND phoneNumber = ?'
  return dbPool.execute(SQLQuery, [email, phoneNumber])
}

const deleteOtpByPhoneNumberQuery = (phoneNumber) => {
  const SQLQuery = 'DELETE FROM `user_otp` WHERE phoneNumber = ?'
  return dbPool.execute(SQLQuery, [phoneNumber])
}

const saveOtpQuery = (email, phoneNumber, otp, expirationTime) => {
  const SQLQuery =
    'INSERT INTO `user_otp` (email, phoneNumber, otp, expirationTime) VALUES (?, ?, ?, ?)'
  return dbPool.execute(SQLQuery, [email, phoneNumber, otp, expirationTime])
}

const getOtpByPhoneNumberQuery = (phoneNumber) => {
  const SQLQuery =
    'SELECT otp FROM `user_otp` WHERE phoneNumber = ? ORDER BY createdAt DESC LIMIT 1'
  return dbPool.execute(SQLQuery, [phoneNumber])
}

const getUserInfoQuery = (userId) => {
  const SQLQuery =
    'SELECT users.email, users.full_name, users.phone_number, user_website.domain, user_website.status FROM `users` INNER JOIN `user_website` ON users.id = user_website.user_id WHERE users.id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const getUserIdQuery = (userId) => {
  const SQLQuery = 'SELECT id FROM `users` WHERE id = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const updatePasswordQuery = ({ password, phoneNumber }) => {
  const SQLQuery = 'UPDATE `users` SET password = ? WHERE phone_number = ?'
  return dbPool.execute(SQLQuery, [password, phoneNumber])
}

const getUserByApiKeyQuery = (apiKey) => {
  const SQLQuery = 'SELECT id, api_key FROM users WHERE api_key = ?'
  return dbPool.execute(SQLQuery, [apiKey])
}

module.exports = {
  createUserQuery,
  createUserWebsiteQuery,
  createTransactionQuery,
  getUserByEmailQuery,
  getUserByPhoneQuery,
  resetOtpQuery,
  saveOtpQuery,
  getOtpByPhoneNumberQuery,
  deleteOtpByPhoneNumberQuery,
  getUserInfoQuery,
  getUserIdQuery,
  updatePasswordQuery,
  getUserIdByTokenQuery,
  getUserByApiKeyQuery,
}
