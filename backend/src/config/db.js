// Database connection configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('[DB] Starting database connection process...');
  
  // First try to connect to MongoDB Atlas
  try {
    console.log('[DB] Attempting to connect to MongoDB Atlas...');
    console.log('[DB] MONGO_URI exists:', !!process.env.MONGO_URI);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[DB] MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (atlasError) {
    console.error(`[DB] MongoDB Atlas connection error: ${atlasError.message}`);
    
    // If Atlas fails, try local MongoDB
    console.log('[DB] Attempting to connect to local MongoDB...');
    try {
      const localConn = await mongoose.connect('mongodb://localhost:27017/madani_course');
      console.log(`[DB] Local MongoDB Connected: ${localConn.connection.host}`);
      return localConn;
    } catch (localError) {
      console.error(`[DB] Local MongoDB connection error: ${localError.message}`);
      console.error('[DB] No MongoDB instance available. Please ensure MongoDB is running locally or check your Atlas connection.');
      // Don't exit the process, let the application continue without DB if needed for development
      throw new Error('Database connection failed');
    }
  }
};

module.exports = connectDB;