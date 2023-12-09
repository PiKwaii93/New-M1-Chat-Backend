const mysqlPool = require("../database/config");

module.exports.getUsers = async () => {
  const [results] = await mysqlPool.query("SELECT * FROM Users");
  return results;
};

module.exports.getUserById = async (id) => {
  const [[results]] = await mysqlPool.query(
    "SELECT * FROM Users WHERE id = ?",
    [id]
  );
  return results;
};

module.exports.getUserByEmail = async (email) => {
  const [[results]] = await mysqlPool.query(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  );
  return results;
};

module.exports.deleteUserById = async (id) => {
  const [{ affectedRows }] = await mysqlPool.query(
    "DELETE FROM Users WHERE id = ?",
    [id]
  );
  return affectedRows;
};

module.exports.createUser = async (data) => {
  const [{ affectedRows }] = await mysqlPool.query(
    "INSERT INTO Users (full_name, password, email) VALUES (?, ?, ?)",
    [data.full_name, data.password, data.email]
  );
  return affectedRows;
};

module.exports.updateUser = async (data, id) => {
  const [{ affectedRows }] = await mysqlPool.query(
    "UPDATE Users SET full_name = ?, email = ?, password = ?, token = ? WHERE id = ?",
    [data.full_name, data.email, data.password, data.token, id]
  );
  return affectedRows;
};
