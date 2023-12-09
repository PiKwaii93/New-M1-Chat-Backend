const mysql = require("mysql2/promise");

const mysqlPool = mysql.createPool({
  host: "localhost",
  user: "hips-admin",
  password: "Azerty123456?",
  database: "hips_api",
});

module.exports = mysqlPool;
