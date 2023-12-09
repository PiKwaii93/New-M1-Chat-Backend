const express = require("express");
const router = express.Router();

const service = require("../services/conversations.service");
const serviceUser = require("../services/users.service");

router.get("/", async (req, res) => {
  try {
    const conversations = await service.getConversations();
    res.status(200).send(conversations);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user_id = req.params.userId;
    const conversations = await service.getConversationsByUserId(user_id);
    const conversationsWithUser = Promise.all(
      conversations.map(async (conversation) => {
        const contactId =
          conversation.user_id_1 === Number(user_id)
            ? conversation.user_id_2
            : conversation.user_id_1;

        const contact = await serviceUser.getUserById(contactId);

        if (contact === undefined) {
          throw new Error("User doesn't exist");
        }

        return {
          id: conversation.id,
          contact: {
            id: contact.id,
            email: contact.email,
            full_name: contact.full_name,
          },
        };
      })
    );

    res.status(200).send(await conversationsWithUser);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    data.created_at = new Date();
    data.updated_at = new Date();

    const insertId = await service.createConversation(data);

    if (!insertId) {
      throw new Error("This conversation can't be added");
    }

    res.status(200).send({ success: "Conversation added successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
