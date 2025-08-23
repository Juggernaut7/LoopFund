const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class NotificationSocket {
  constructor(server) {
    // Create WebSocket server on the /ws path
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws' // This specifies the WebSocket endpoint
    });
    this.clients = new Map(); // userId -> WebSocket connection
    
    console.log('🔌 WebSocket server created on /ws path');
    
    this.wss.on('connection', (ws, req) => {
      console.log('🔗 New WebSocket connection attempt:', req.url);
      this.handleConnection(ws, req);
    });

    this.wss.on('error', (error) => {
      console.error('❌ WebSocket server error:', error);
    });
  }

  handleConnection(ws, req) {
    try {
      // Extract token from query string
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get('token');
      
      console.log('🔐 WebSocket auth - Token present:', !!token);
      
      if (!token) {
        console.log('❌ WebSocket: No token provided');
        ws.close(1008, 'Authentication required');
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
      
      console.log('✅ WebSocket: User authenticated:', userId);
      
      // Store client connection
      this.clients.set(userId, ws);
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to LoopFund notifications'
      }));

      ws.on('close', (code, reason) => {
        console.log(`🔌 User ${userId} disconnected:`, code, reason);
        this.clients.delete(userId);
      });

      ws.on('error', (error) => {
        console.error(`❌ WebSocket error for user ${userId}:`, error);
        this.clients.delete(userId);
      });

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          console.log('📨 WebSocket message from user:', userId, data);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      });

    } catch (error) {
      console.error('❌ WebSocket authentication error:', error.message);
      ws.close(1008, 'Invalid token');
    }
  }

  // Send notification to specific user
  sendNotification(userId, notification) {
    const ws = this.clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: 'notification',
        data: notification
      });
      ws.send(message);
      console.log('📤 Sent notification to user:', userId);
    } else {
      console.log('❌ User not connected or connection closed:', userId);
    }
  }

  // Send notification to multiple users
  sendNotificationToUsers(userIds, notification) {
    userIds.forEach(userId => {
      this.sendNotification(userId, notification);
    });
  }

  // Broadcast to all connected clients
  broadcast(data) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // Get connected clients count
  getConnectedClientsCount() {
    return this.clients.size;
  }
}

module.exports = NotificationSocket; 