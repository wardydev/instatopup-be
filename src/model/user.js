const dbPool = require("../config/db.js");

const createUser = ({ username, email, phoneNumber, password }) => {
  const SQLQuery = `INSERT INTO user(username, email, phoneNumber, password, createdAt) VALUES (?, ?, ?, ?, NOW())`;

  return dbPool.execute(SQLQuery, [username, email, phoneNumber, password]);
};

const getUserByEmail = (email) => {
  const SQLQuery = `SELECT * FROM user WHERE email = ?`;
  return dbPool.execute(SQLQuery, [email]);
};

module.exports = {
  createUser,
  getUserByEmail,
};
