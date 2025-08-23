const { server } = require('./src/app');

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server available at ws://localhost:${PORT}/ws`);
  console.log(` API Documentation: http://localhost:${PORT}/docs`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
}); 