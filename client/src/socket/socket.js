// socket.js - Socket.io client setup

import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://my-chat-app-mahwayiruth.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // User authentication
  joinChat(username) {
    if (this.socket) {
      this.socket.emit('user-joined', username);
    }
  }

  // Send message
  sendMessage(text) {
    if (this.socket) {
      this.socket.emit('send-message', { text });
    }
  }

  // Send private message
  sendPrivateMessage(to, text) {
    if (this.socket) {
      this.socket.emit('private-message', { to, text });
    }
  }

  // Typing indicators
  startTyping() {
    if (this.socket) {
      this.socket.emit('typing');
    }
  }

  stopTyping() {
    if (this.socket) {
      this.socket.emit('stop-typing');
    }
  }

  // Mark message as read
  markMessageAsRead(messageId) {
    if (this.socket) {
      this.socket.emit('message-read', messageId);
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  onLoadMessages(callback) {
    if (this.socket) {
      this.socket.on('load-messages', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user-joined-notification', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user-left-notification', callback);
    }
  }

  onUserListUpdate(callback) {
    if (this.socket) {
      this.socket.on('user-list-update', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on('user-stop-typing', callback);
    }
  }

  onPrivateMessage(callback) {
    if (this.socket) {
      this.socket.on('private-message', callback);
    }
  }

  onMessageReadReceipt(callback) {
    if (this.socket) {
      this.socket.on('message-read-receipt', callback);
    }
  }

  // Remove event listeners
  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();
