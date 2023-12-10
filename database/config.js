const mysql = require("mysql2/promise");

const mysqlPool = mysql.createPool({
  host: "51.20.79.100",
  user: "admin",
  password: "password",
  database: "test",
});

module.exports = mysqlPool;
