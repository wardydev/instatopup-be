const mysql = require("mysql2");

const dbPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "template_auth",
  connectionLimit: 10,
});

dbPool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to database!");
    connection.release();
  }
});

module.exports = dbPool.promise();
