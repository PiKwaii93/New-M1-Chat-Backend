const mysqlPool = require("../database/config");

module.exports.getConversations = async () => {
  const [results] = await mysqlPool.query(
    "SELECT * FROM Conversations C INNER JOIN Conversations_To_Users CTU ON CTU.conversation_id = C.id INNER JOIN Users U ON U.id = CTU.id "
  );
  return results;
};

module.exports.getConversationsByUserId = async (id) => {
  const [results] = await mysqlPool.query(
    "SELECT * FROM Conversations WHERE user_id_1 = ? OR user_id_2 = ? ",
    [id, id]
  );
  return results;
};

module.exports.createConversation = async (data) => {
  const [{ insertId }] = await mysqlPool.query(
    "INSERT INTO Conversations (user_id_1, user_id_2, created_at, updated_at) VALUES (?, ?, ?, ?)",
    [data.user_id_1, data.user_id_2, data.created_at, data.updated_at]
  );
  return insertId;
};
