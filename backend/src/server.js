const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Add startup logging
console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT || 5000);

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

// Add a root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Madani Course Backend is running', timestamp: new Date().toISOString() });
});

// Add a health check route
app.get('/health', (req, res) => {
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/uploads', gridfsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/exam', examRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
console.log('Attempting to connect to database...');
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    logger.info(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  logger.error('Failed to start server:', error);
  process.exit(1);
});