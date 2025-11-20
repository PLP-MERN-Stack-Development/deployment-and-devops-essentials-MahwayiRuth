const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store connected users
const users = new Map();
const messages = [];

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user authentication/joining
  socket.on('user-joined', (username) => {
    users.set(socket.id, {
      id: socket.id,
      username: username,
      online: true
    });
    
    // Send existing messages to new user
    socket.emit('load-messages', messages);
    
    // Broadcast to all clients that a new user joined
    io.emit('user-list-update', Array.from(users.values()));
    io.emit('user-joined-notification', {
      username: username,
      timestamp: new Date().toISOString()
    });
    
    console.log(`${username} joined the chat`);
  });

  // Handle new messages
  socket.on('send-message', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const message = {
        id: Date.now(),
        username: user.username,
        text: data.text,
        timestamp: new Date().toISOString()
      };
      
      messages.push(message);
      
      // Broadcast message to all clients
      io.emit('new-message', message);
    }
  });

  // Handle typing indicator
  socket.on('typing', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-typing', {
        username: user.username
      });
    }
  });

  socket.on('stop-typing', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-stop-typing', {
        username: user.username
      });
    }
  });

  // Handle private messages
  socket.on('private-message', (data) => {
    const sender = users.get(socket.id);
    if (sender) {
      const message = {
        id: Date.now(),
        from: sender.username,
        text: data.text,
        timestamp: new Date().toISOString(),
        private: true
      };
      
      // Find recipient socket
      for (let [socketId, user] of users.entries()) {
        if (user.username === data.to) {
          io.to(socketId).emit('private-message', message);
          socket.emit('private-message', message); // Send to sender too
          break;
        }
      }
    }
  });

  // Handle message read receipts
  socket.on('message-read', (messageId) => {
    const user = users.get(socket.id);
    if (user) {
      io.emit('message-read-receipt', {
        messageId: messageId,
        readBy: user.username,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`${user.username} disconnected`);
      
      // Broadcast user left
      io.emit('user-left-notification', {
        username: user.username,
        timestamp: new Date().toISOString()
      });
      
      users.delete(socket.id);
      io.emit('user-list-update', Array.from(users.values()));
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
