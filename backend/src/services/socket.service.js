const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const CommunityPost = require('../models/CommunityPost');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socket
    this.userSockets = new Map(); // userId -> Set of socketIds
  }

  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    
    console.log('🔌 Socket.IO initialized for real-time community features');
  }

  setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
        
        if (!token) {
          // Allow anonymous connections for public features
          socket.userId = null;
          socket.isAuthenticated = false;
          return next();
        }

        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.isAuthenticated = true;
        socket.user = decoded;
        
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        socket.userId = null;
        socket.isAuthenticated = false;
        next();
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 User connected: ${socket.userId || 'Anonymous'}`);

      // Store user connection
      if (socket.userId) {
        this.addUserSocket(socket.userId, socket.id);
      }

      // Join community room
      socket.join('community');

      // Handle post creation
      socket.on('create_post', async (postData) => {
        try {
          if (!socket.isAuthenticated) {
            socket.emit('error', { message: 'Authentication required' });
            return;
          }

          // Emit to all users in community
          this.io.to('community').emit('new_post', {
            ...postData,
            author: socket.user,
            createdAt: new Date(),
            id: Date.now().toString() // Temporary ID for real-time
          });

          socket.emit('post_created', { success: true });
        } catch (error) {
          console.error('Error creating post via socket:', error);
          socket.emit('error', { message: 'Failed to create post' });
        }
      });

      // Handle post like/unlike
      socket.on('toggle_like', async (postId) => {
        try {
          if (!socket.isAuthenticated) {
            socket.emit('error', { message: 'Authentication required' });
            return;
          }

          // Emit like update to all users
          this.io.to('community').emit('post_liked', {
            postId,
            userId: socket.userId,
            user: socket.user
          });

          socket.emit('like_toggled', { success: true });
        } catch (error) {
          console.error('Error toggling like via socket:', error);
          socket.emit('error', { message: 'Failed to toggle like' });
        }
      });

      // Handle comment addition
      socket.on('add_comment', async (commentData) => {
        try {
          if (!socket.isAuthenticated) {
            socket.emit('error', { message: 'Authentication required' });
            return;
          }

          // Emit comment to all users
          this.io.to('community').emit('new_comment', {
            ...commentData,
            author: socket.user,
            createdAt: new Date(),
            id: Date.now().toString() // Temporary ID for real-time
          });

          socket.emit('comment_added', { success: true });
        } catch (error) {
          console.error('Error adding comment via socket:', error);
          socket.emit('error', { message: 'Failed to add comment' });
        }
      });

      // Handle real-time typing indicators
      socket.on('typing_start', (postId) => {
        if (socket.isAuthenticated) {
          socket.to('community').emit('user_typing', {
            postId,
            userId: socket.userId,
            userName: socket.user.name
          });
        }
      });

      socket.on('typing_stop', (postId) => {
        if (socket.isAuthenticated) {
          socket.to('community').emit('user_stopped_typing', {
            postId,
            userId: socket.userId
          });
        }
      });

      // Handle user status updates
      socket.on('update_status', (status) => {
        if (socket.isAuthenticated) {
          this.io.to('community').emit('user_status_changed', {
            userId: socket.userId,
            user: socket.user,
            status
          });
        }
      });

      // Handle private messages (financial buddy system)
      socket.on('send_private_message', (data) => {
        try {
          if (!socket.isAuthenticated) {
            socket.emit('error', { message: 'Authentication required' });
            return;
          }

          const { recipientId, message } = data;
          
          // Send to specific user
          const recipientSocket = this.getUserSocket(recipientId);
          if (recipientSocket) {
            recipientSocket.emit('private_message', {
              from: socket.user,
              message,
              timestamp: new Date()
            });
          }

          socket.emit('message_sent', { success: true });
        } catch (error) {
          console.error('Error sending private message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle community challenges and events
      socket.on('join_challenge', (challengeId) => {
        if (socket.isAuthenticated) {
          socket.join(`challenge_${challengeId}`);
          this.io.to(`challenge_${challengeId}`).emit('user_joined_challenge', {
            userId: socket.userId,
            user: socket.user,
            challengeId
          });
        }
      });

      socket.on('challenge_progress', (data) => {
        if (socket.isAuthenticated) {
          this.io.to(`challenge_${data.challengeId}`).emit('challenge_update', {
            userId: socket.userId,
            user: socket.user,
            progress: data.progress,
            challengeId: data.challengeId
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.userId || 'Anonymous'}`);
        
        if (socket.userId) {
          this.removeUserSocket(socket.userId, socket.id);
          
          // Notify others about user leaving
          this.io.to('community').emit('user_disconnected', {
            userId: socket.userId,
            user: socket.user
          });
        }
      });
    });
  }

  // Helper methods
  addUserSocket(userId, socketId) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socketId);
    this.connectedUsers.set(socketId, userId);
  }

  removeUserSocket(userId, socketId) {
    if (this.userSockets.has(userId)) {
      this.userSockets.get(userId).delete(socketId);
      if (this.userSockets.get(userId).size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.connectedUsers.delete(socketId);
  }

  getUserSocket(userId) {
    if (this.userSockets.has(userId)) {
      const socketIds = Array.from(this.userSockets.get(userId));
      if (socketIds.length > 0) {
        return this.io.sockets.sockets.get(socketIds[0]);
      }
    }
    return null;
  }

  // Broadcast methods for server-side events
  broadcastNewPost(post) {
    this.io.to('community').emit('new_post', post);
  }

  broadcastPostUpdate(postId, updates) {
    this.io.to('community').emit('post_updated', { postId, updates });
  }

  broadcastPostDeleted(postId) {
    this.io.to('community').emit('post_deleted', { postId });
  }

  broadcastLikeUpdate(postId, userId, action) {
    this.io.to('community').emit('like_updated', { postId, userId, action });
  }

  broadcastCommentUpdate(postId, comment) {
    this.io.to('community').emit('comment_updated', { postId, comment });
  }

  broadcastCommunityEvent(event) {
    this.io.to('community').emit('community_event', event);
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.userSockets.size;
  }

  // Get online users
  getOnlineUsers() {
    return Array.from(this.userSockets.keys());
  }
}

module.exports = new SocketService(); 