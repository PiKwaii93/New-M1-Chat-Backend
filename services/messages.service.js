const mysqlPool = require("../database/config");

module.exports.getMessages = async () => {
  const [results] = await mysqlPool.query("SELECT * FROM Messages");
  return results;
};

module.exports.getMessagesByConversationId = async (id) => {
  const [results] = await mysqlPool.query(
    "SELECT id, sender_id, content, updated_at FROM Messages WHERE conversation_id = ?",
    [id]
  );
  return results;
};

module.exports.createMessages = async (data) => {
  const [{ insertId }] = await mysqlPool.query(
    "INSERT INTO Messages (conversation_id, sender_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [
      data.conversation_id,
      data.sender_id,
      data.content,
      data.created_at,
      data.updated_at,
    ]
  );
  return insertId;
};
