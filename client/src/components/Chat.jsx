import React, { useState, useEffect, useRef } from 'react';
import socketService from '../socket/socket';
import './Chat.css';

const Chat = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio for notifications
    audioRef.current = new Audio('/notification.mp3');
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      // Connect socket
      socketService.connect();
      socketService.joinChat(username);

      // Load existing messages
      socketService.onLoadMessages((loadedMessages) => {
        setMessages(loadedMessages);
      });

      // Listen for new messages
      socketService.onNewMessage((message) => {
        setMessages((prev) => [...prev, message]);
        
        // Play notification sound
        if (message.username !== username) {
          playNotificationSound();
          if (document.hidden) {
            setUnreadCount((prev) => prev + 1);
            showBrowserNotification(message.username, message.text);
          }
        }
      });

      // Listen for user list updates
      socketService.onUserListUpdate((users) => {
        setOnlineUsers(users);
      });

      // Listen for typing indicators
      socketService.onUserTyping((data) => {
        setTypingUsers((prev) => {
          if (!prev.includes(data.username)) {
            return [...prev, data.username];
          }
          return prev;
        });
      });

      socketService.onUserStopTyping((data) => {
        setTypingUsers((prev) => prev.filter(u => u !== data.username));
      });

      // Listen for user joined/left
      socketService.onUserJoined((data) => {
        addNotification(`${data.username} joined the chat`, 'success');
      });

      socketService.onUserLeft((data) => {
        addNotification(`${data.username} left the chat`, 'info');
      });

      // Listen for private messages
      socketService.onPrivateMessage((message) => {
        setMessages((prev) => [...prev, message]);
        if (message.from !== username) {
          addNotification(`Private message from ${message.from}`, 'info');
        }
      });

      // Document visibility change
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          setUnreadCount(0);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isLoggedIn, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
      requestNotificationPermission();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (selectedUser) {
        socketService.sendPrivateMessage(selectedUser, newMessage);
      } else {
        socketService.sendMessage(newMessage);
      }
      setNewMessage('');
      socketService.stopTyping();
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    socketService.startTyping();
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping();
    }, 1000);
  };

  const addNotification = (message, type) => {
    const notification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications((prev) => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications((prev) => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const showBrowserNotification = (sender, text) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`New message from ${sender}`, {
        body: text,
        icon: '/chat-icon.png'
      });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const selectUserForPrivateChat = (user) => {
    if (user.username !== username) {
      setSelectedUser(user.username === selectedUser ? null : user.username);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Welcome to Chat App</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              maxLength={20}
              required
            />
            <button type="submit" className="login-button">
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Notifications */}
      <div className="notifications">
        {notifications.map((notif) => (
          <div key={notif.id} className={`notification ${notif.type}`}>
            {notif.message}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Online Users ({onlineUsers.length})</h3>
        </div>
        <div className="user-list">
          {onlineUsers.map((user) => (
            <div
              key={user.id}
              className={`user-item ${user.username === username ? 'current-user' : ''} ${selectedUser === user.username ? 'selected' : ''}`}
              onClick={() => selectUserForPrivateChat(user)}
            >
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user.username}
                  {user.username === username && ' (You)'}
                </span>
                <span className="user-status online">●</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        <div className="chat-header">
          <h2>
            {selectedUser ? `Private Chat with ${selectedUser}` : 'Global Chat Room'}
          </h2>
          {selectedUser && (
            <button 
              className="close-private-chat"
              onClick={() => setSelectedUser(null)}
            >
              ✕ Close Private Chat
            </button>
          )}
          {unreadCount > 0 && (
            <div className="unread-badge">{unreadCount} new</div>
          )}
        </div>

        <div className="messages-container">
          {messages
            .filter(msg => !selectedUser || msg.private)
            .map((message, index) => (
            <div
              key={message.id || index}
              className={`message ${message.username === username ? 'own-message' : 'other-message'} ${message.private ? 'private-message' : ''}`}
            >
              <div className="message-header">
                <span className="message-username">
                  {message.username || message.from}
                </span>
                <span className="message-timestamp">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <div className="message-text">{message.text}</div>
              {message.private && (
                <span className="private-label">🔒 Private</span>
              )}
            </div>
          ))}
          
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing
              <span className="typing-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            placeholder={selectedUser ? `Private message to ${selectedUser}...` : "Type a message..."}
            value={newMessage}
            onChange={handleTyping}
            className="message-input"
          />
          <button type="submit" className="send-button" disabled={!newMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
