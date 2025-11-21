# Real-Time Chat Application with Socket.io

A fully functional real-time chat application built with React, Node.js, Express, and Socket.io featuring bidirectional communication, user authentication, and advanced chat features.

## 🚀 Features Implemented

### 1. Project Setup ✅
- Node.js server with Express
- Socket.io configured on server side
- React front-end application
- Socket.io client in React app
- Basic connection between client and server

### 2. Core Chat Functionality ✅
- User authentication (username-based)
- Global chat room for all users
- Messages displayed with sender's name and timestamp
- Real-time typing indicators
- Online/offline status for users

### 3. Advanced Chat Features ✅
- Private messaging between users
- Multiple chat rooms support
- "User is typing" indicator
- Message reactions (like, love, etc.) - Framework ready
- Read receipts for messages

### 4. Real-Time Notifications ✅
- Notifications when receiving new messages
- Notifications when users join/leave chat rooms
- Unread message count display
- Sound notifications for new messages
- Browser notifications using Web Notifications API

### 5. Performance and UX Optimization ✅
- Message pagination (loadable)
- Reconnection logic for handling disconnections
- Socket.io optimized with namespaces and rooms
- Message delivery acknowledgment
- Responsive design for desktop and mobile devices

## 📁 Project Structure

```
socketio-chat/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   └── Chat.css
│   │   ├── socket/
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/
│   ├── server.js
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Modern web browser

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```


### Client Setup

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React application:
```bash
npm start
```

The client will run on `http://localhost:3000`

## 🎮 How to Use

1. **Join the Chat**
   - Enter your username on the login screen
   - Click "Join Chat" to enter the chat room

2. **Send Messages**
   - Type your message in the input field at the bottom
   - Press Enter or click "Send" to send the message

3. **Private Messaging**
   - Click on any user in the sidebar (except yourself)
   - Send private messages that only that user can see
   - Click "Close Private Chat" to return to global chat

4. **View Online Users**
   - See all connected users in the left sidebar
   - Green dot indicates online status

5. **Typing Indicators**
   - See when other users are typing
   - Your typing status is shown to others

6. **Notifications**
   - Receive notifications when users join/leave
   - Get notified of new messages with sound
   - Browser notifications when tab is not focused

## 🎨 Features Details

### User Authentication
- Simple username-based authentication
- Usernames are unique per session
- User presence tracking

### Real-Time Messaging
- Instant message delivery
- Message history loaded on join
- Timestamps for all messages
- Sender identification

### Typing Indicators
- Shows when users are typing
- Auto-hides after 1 second of inactivity
- Multiple users typing support

### Private Messaging
- One-on-one conversations
- Private message indicators
- Easy switching between private and global chat

### Notifications
- In-app notifications for user events
- Sound alerts for new messages
- Browser notifications (requires permission)
- Unread message counter

### User Interface
- Clean, modern design
- Responsive layout (mobile and desktop)
- Smooth animations and transitions
- User-friendly interface
- Color-coded messages

## 🔧 Technical Implementation

### Server Side (Node.js + Express + Socket.io)
- Express server for HTTP handling
- Socket.io for WebSocket connections
- In-memory storage for users and messages
- Event-based architecture for real-time features
- CORS enabled for cross-origin requests

### Client Side (React + Socket.io-client)
- React hooks for state management
- Socket.io-client for WebSocket connection
- Component-based architecture
- CSS for styling and animations
- Web Notifications API integration

### Socket Events Implemented

**Client to Server:**
- `user-joined` - User joins the chat
- `send-message` - Send a message to global chat
- `private-message` - Send a private message
- `typing` - User starts typing
- `stop-typing` - User stops typing
- `message-read` - Mark message as read

**Server to Client:**
- `load-messages` - Load message history
- `new-message` - New message received
- `user-joined-notification` - User joined notification
- `user-left-notification` - User left notification
- `user-list-update` - Updated online users list
- `user-typing` - Someone is typing
- `user-stop-typing` - Someone stopped typing
- `private-message` - Private message received
- `message-read-receipt` - Message read confirmation

## 🚀 Deployment (Optional)

### Server Deployment
Deploy to platforms like:
- Render
- Railway
- Heroku
- DigitalOcean

### Client Deployment
Deploy to platforms like:
- Vercel
- Netlify
- GitHub Pages

Make sure to update the `SOCKET_URL` in the client's socket.js file to point to your deployed server.

## 📝 Environment Variables

Create a `.env` file in the client directory:
```
REACT_APP_SOCKET_URL=http://localhost:5000
```

For production, update this to your deployed server URL.

## 🐛 Troubleshooting

### Connection Issues
- Ensure both server and client are running
- Check that ports 3000 and 5000 are not in use
- Verify CORS settings in server.js

### Messages Not Sending
- Check browser console for errors
- Verify Socket.io connection status
- Ensure server is running

### Notifications Not Working
- Allow browser notifications when prompted
- Check browser notification settings
- Some browsers require HTTPS for notifications

## 📚 Technologies Used

- **Frontend:**
  - React 18.2.0
  - Socket.io-client 4.6.1
  - CSS3

- **Backend:**
  - Node.js
  - Express 4.18.2
  - Socket.io 4.6.1
  - CORS 2.8.5

## 🎯 Future Enhancements

- File and image sharing
- Message reactions (emoji reactions)
- Message search functionality
- Chat room creation
- User profiles and avatars
- Message editing and deletion
- End-to-end encryption
- Database integration for message persistence
- User authentication with JWT

## 👨‍💻 Author:Ruth Mahwayi

## 📄 License

MIT License - Feel free to use this project for learning purposes.
