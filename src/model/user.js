const dbPool = require("../config/db.js");

const getUserByEmailQuery = (email) => {
  const SQLQuery = `SELECT * FROM user WHERE email = ?`;
  return dbPool.execute(SQLQuery, [email]);
};

const getUserById = (userId) => {
  const SQLQuery = `SELECT * FROM user WHERE id = ?`;
  return dbPool.execute(SQLQuery, [userId]);
};

const getUserByEmailAuthorizationQuery = (email) => {
  const SQLQuery = `SELECT id, username, email, phoneNumber, createdAt FROM user WHERE email = ?`;
  return dbPool.execute(SQLQuery, [email]);
};

const createUserQuery = ({ username, email, phoneNumber, password }) => {
  const SQLQuery = `INSERT INTO user (username, email, phoneNumber, password, createdAt) 
                    VALUES (?, ?, ?, ?, NOW())`;
  const values = [username, email, phoneNumber, password];
  return dbPool.execute(SQLQuery, values);
};

const updateUserPasswordQuery = (userId, hashedPassword) => {
  const SQLQuery = "UPDATE user SET password = ? WHERE id = ?";
  return dbPool.execute(SQLQuery, [hashedPassword, userId]);
};

module.exports = {
  getUserByEmailQuery,
  createUserQuery,
  getUserByEmailAuthorizationQuery,
  updateUserPasswordQuery,
  getUserById,
};
