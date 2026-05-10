const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./api/routes/authRoutes');
const executionRoutes = require('./api/routes/executionRoutes');
const sessionRoutes = require('./api/routes/sessionRoutes');
const taskRoutes = require('./api/routes/taskRoutes');
const logRoutes = require('./api/routes/logRoutes');
const screenshotRoutes = require('./api/routes/screenshotRoutes');
const ocrRoutes = require('./api/routes/ocrRoutes');

// Import services
const { initializeDatabase } = require('./services/database/connectionPool');
const { setupWebSocket } = require('./services/websocket/socketHandler');
const { initializeAutomationQueue } = require('./services/automation/queueManager');

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.WS_CORS_ORIGIN || 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use('/screenshots', express.static(path.join(__dirname, '../screenshots')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/screenshots', screenshotRoutes);
app.use('/api/ocr', ocrRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize services
async function initialize() {
  try {
    console.log('🚀 Initializing Automation Operations Platform...');

    // Initialize database
    console.log('📊 Connecting to database...');
    await initializeDatabase();
    console.log('✅ Database connected');

    // Setup WebSocket
    console.log('📡 Setting up WebSocket...');
    setupWebSocket(io);
    console.log('✅ WebSocket initialized');

    // Initialize automation queue
    console.log('⚙️  Initializing automation queue...');
    await initializeAutomationQueue(io);
    console.log('✅ Automation queue initialized');

    // Start server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`\n✨ Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}`);
      console.log(`📡 WebSocket: ws://localhost:${PORT}`);
      console.log(`\n🎯 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Start application
initialize();

module.exports = { app, server, io };
