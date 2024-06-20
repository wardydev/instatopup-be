const dbPool = require("../config/db.js");

const saveOtpQuery = (email, phoneNumber, otp, expirationTime) => {
  const SQLQuery = `INSERT INTO otp (email, phoneNumber, otp, expirationTime, createdAt) VALUES (?, ?, ?, ?, NOW())`;
  return dbPool.execute(SQLQuery, [email, phoneNumber, otp, expirationTime]);
};

const getOtpByEmailQuery = (email) => {
  const SQLQuery = `SELECT * FROM otp WHERE email = ? ORDER BY createdAt DESC LIMIT 1`;
  return dbPool.execute(SQLQuery, [email]);
};

const deleteOtpQuery = (email) => {
  const SQLQuery = `DELETE FROM otp WHERE email = ?`;
  return dbPool.execute(SQLQuery, [email]);
};

module.exports = {
  saveOtpQuery,
  getOtpByEmailQuery,
  deleteOtpQuery,
};
