const dbPool = require('../config/db.js')

const saveOtpQuery = (email, phoneNumber, otp, expirationTime) => {
  const SQLQuery = `INSERT INTO user_otp (email, phoneNumber, otp, expirationTime, createdAt) VALUES (?, ?, ?, ?, NOW())`
  return dbPool.execute(SQLQuery, [email, phoneNumber, otp, expirationTime])
}

const getOtpByEmailQuery = (email) => {
  const SQLQuery = `SELECT * FROM user_otp WHERE email = ? ORDER BY createdAt DESC LIMIT 1`
  return dbPool.execute(SQLQuery, [email])
}

const getOtpByPhoneQuery = (phone) => {
  const SQLQuery = `SELECT * FROM user_otp WHERE phoneNumber = ? ORDER BY createdAt DESC LIMIT 1`
  return dbPool.execute(SQLQuery, [phone])
}

const deleteOtpQuery = (email) => {
  const SQLQuery = `DELETE FROM user_otp WHERE email = ?`
  return dbPool.execute(SQLQuery, [email])
}

module.exports = {
  saveOtpQuery,
  getOtpByEmailQuery,
  deleteOtpQuery,
  getOtpByPhoneQuery,
  getOtpByPhoneQuery,
}
