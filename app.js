// Import
const express = require("express");
const cors = require("cors");
const app = express();
require("express-async-errors");
const io = require("socket.io")(4080, {
  cors: {
    origin: "http://16.16.211.19/",
  },
});

const mysqlPool = require("./database/config");

// app Use
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 4000;

// Middlewares
const usersRoutes = require("./controllers/users.controller");
const conversationsRoutes = require("./controllers/conversations.controller");
const messagesRoutes = require("./controllers/messages.controller");

app.use("/api/users", usersRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/messages", messagesRoutes);

app.get('/home', (req, res) => {
  res.send('This is a test response!');
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .send({ message: "Something went wrong", error: err.message });
});

// Run socket.io
let users = [];
io.on("connection", (socket) => {
  // Add an event handler for the connection error
  socket.on("error", (error) => {
    console.error(`Socket.IO connection error: ${error.message}`);
  });

  // Continue with your existing code
  socket.on("addUser", async (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
    io.emit("disconnectUser");
  });

  socket.on("userDeleted", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsersWhenOneDeleted", users);
  });

  socket.on("userCreatedOrUpdate", () => {
    io.emit("getUsersWhenOneCreatedOrUpdate");
  });

  socket.on(
    "sendMessage",
    ({ id, sender_id, receiver_id, content, updated_at, conversation_id }) => {
      const receiver = users.find((user) => user.userId === receiver_id);

      if (receiver) {
        io.to(receiver.socketId).to(socket.id).emit("getMessage", {
          id,
          sender_id,
          updated_at,
          content,
          conversation_id,
        });
      } else {
        io.to(socket.id).emit("getMessage", {
          conversation_id,
          id,
          sender_id,
          updated_at,
          content,
        });
      }
    }
  );
});


// Database services
const serviceUser = require("./services/users.service");

// Connect DB
mysqlPool
  .query("DESCRIBE Messages")
  .then(results => {
    console.log("Query executed successfully:", results);
    console.log("DB connected");
    // Run server
    app.listen(port, async () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  })
  .catch((error) => console.error("DB connection failed :", error));
