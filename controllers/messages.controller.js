const express = require("express");
const router = express.Router();

const service = require("../services/messages.service");
const serviceConversation = require("../services/conversations.service");

router.get("/", async (req, res) => {
  try {
    const messages = await service.getMessages();
    res.status(200).send(messages);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const id = req.params.conversationId;
    const messages = await service.getMessagesByConversationId(id);
    res.status(200).send(messages);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { conversation_id, sender_id, content, receiver_id } = req.body;

    const data = {
      conversation_id,
      sender_id,
      content,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (data.conversation_id === "new" && receiver_id) {
      const conversationData = {
        user_id_1: sender_id,
        user_id_2: receiver_id,
        updated_at: new Date(),
        created_at: new Date(),
      };

      data.conversation_id = await serviceConversation.createConversation(
        conversationData
      );

      if (!data.conversation_id) {
        throw new Error("Conversation couldn't be create");
      }
    }

    const messageId = await service.createMessages(data);

    if (messageId === 0) {
      throw new Error("Message couldn't be send");
    }

    res.status(200).send({
      success: "Message sent successfully",
      message: {
        id: messageId,
        updated_at: data.updated_at,
        conversation_id: data.conversation_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
