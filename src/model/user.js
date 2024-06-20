const dbPool = require("../config/db.js");

const getUserByEmailQuery = (email) => {
  const SQLQuery = `SELECT * FROM user WHERE email = ?`;
  return dbPool.execute(SQLQuery, [email]);
};

const createUserQuery = ({ username, email, phoneNumber, password }) => {
  const SQLQuery = `INSERT INTO user (username, email, phoneNumber, password, createdAt) 
                    VALUES (?, ?, ?, ?, NOW())`;
  const values = [username, email, phoneNumber, password];
  return dbPool.execute(SQLQuery, values);
};

module.exports = {
  getUserByEmailQuery,
  createUserQuery,
};
