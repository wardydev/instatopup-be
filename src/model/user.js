const dbPool = require('../config/db.js')

const createUserQuery = ({
  userId,
  email,
  fullName,
  phoneNumber,
  password,
}) => {
  const SQLQuery =
    'INSERT INTO `users` (id, email, full_name, phone_number, password) VALUES (?, ?, ?, ?, ?)'
  return dbPool.execute(SQLQuery, [
    userId,
    email,
    fullName,
    phoneNumber,
    password,
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
  qrCode,
  amount,
}) => {
  const SQLQuery =
    'INSERT INTO `transaction` (user_id, package_id, invoice, qr_code, amount, status) VALUES (?,?,?,?,?,?)'
  return dbPool.execute(SQLQuery, [
    userId,
    packageId,
    invoice,
    qrCode,
    amount,
    'pending',
  ])
}

const getUserByEmailQuery = (email) => {
  const SQLQuery = 'SELECT email FROM `users` WHERE email = ?'
  return dbPool.execute(SQLQuery, [email])
}
const getUserByPhoneQuery = (phone) => {
  const SQLQuery = 'SELECT phone_number FROM `users` WHERE phone_number = ?'
  return dbPool.execute(SQLQuery, [phone])
}

module.exports = {
  createUserQuery,
  createUserWebsiteQuery,
  createTransactionQuery,
  getUserByEmailQuery,
  getUserByPhoneQuery,
}
