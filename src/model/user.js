const dbPool = require("../config/db.js");

const getUsersQuery = () => {
  const SQLQuery = `SELECT * FROM user`;

  return dbPool.execute(SQLQuery);
};

module.exports = {
  getUsersQuery,
};
