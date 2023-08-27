const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname));

const users = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    const user = users.find((user) => user.socketId === socket.id);
    if (user) {
      user.online = false;
      io.emit('userStatus', users);
    }
  });

  socket.on('joinChat', (username) => {
    const user = {
      username,
      socketId: socket.id,
      online: true,
    };
    users.push(user);
    io.emit('userStatus', users);
  });

  socket.on('chatMessage', (data) => {
    const user = users.find((user) => user.socketId === socket.id);
    if (user) {
      io.emit('chatMessage', { username: user.username, message: data.message });
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
