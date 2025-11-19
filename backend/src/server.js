const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Add comprehensive startup logging
console.log('=== SERVER STARTUP LOGS ===');
console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT || 5000);
console.log('Mongo URI exists:', !!process.env.MONGO_URI);
console.log('JWT Secret exists:', !!process.env.JWT_SECRET);
console.log('Current working directory:', process.cwd());
console.log('==========================');

const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const courseRoutes = require('./routes/course.routes');
const gridfsRoutes = require('./routes/gridfs.routes');
const exportRoutes = require('./routes/export.routes');
const examRoutes = require('./routes/exam.routes');

const { errorHandler } = require('./middleware/error.middleware');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Add comprehensive logging for all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Add a root route for testing
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({ 
    message: 'Madani Course Backend is running', 
    timestamp: new Date().toISOString(),
    routes: {
      auth: '/api/auth',
      students: '/api/students',
      courses: '/api/courses',
      uploads: '/api/uploads',
      export: '/api/export',
      exam: '/api/exam'
    }
  });
});

// Add a health check route
app.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Security middleware
app.use(helmet());
app.use(cors());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log when routes are being mounted
console.log('Mounting routes...');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/uploads', gridfsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/exam', examRoutes);

// Log all registered routes
console.log('Registered routes:');
console.log('- /api/auth/*');
console.log('- /api/students/*');
console.log('- /api/courses/*');
console.log('- /api/uploads/*');
console.log('- /api/export/*');
console.log('- /api/exam/*');

// Add a proper 404 handler (must be after all routes)
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
console.log('Attempting to connect to database...');
connectDB().then(() => {
  console.log('Database connected successfully');
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    logger.info(`Server running on port ${PORT}`);
  });
  
  // Log when server is closing
  server.on('close', () => {
    console.log('Server is closing');
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  logger.error('Failed to start server:', error);
  process.exit(1);
});