const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Example: Listen for events from clients if needed
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io for use in your API routes or other backend logic
module.exports = io;

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
