const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const app = express();
const port = 3001 || process.env.PORT;
const users = [{}];
app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome!");
});
const server = http.createServer(app);
const io = socketIO(server);
io.on("connection", (socket) => {
  console.log("New Connection");
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat,${user}`,
    });
  });
  socket.on("disconect", () => {
    socket.broadcast.emit("leave", {
      user: "admin",
      message: `${users[socket.id]} has left`,
    });
    console.log(`user disconnected`);
  });
  socket.on("message", ({ message,id }) => {
    io.emit("sendMessage", { user: users[socket.id], message, id });
  });
});
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
