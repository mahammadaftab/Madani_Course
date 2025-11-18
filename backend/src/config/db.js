// Database connection configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  // First try to connect to MongoDB Atlas
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (atlasError) {
    console.error(`MongoDB Atlas connection error: ${atlasError.message}`);
    
    // If Atlas fails, try local MongoDB
    console.log('Attempting to connect to local MongoDB...');
    try {
      const localConn = await mongoose.connect('mongodb://localhost:27017/madani_course');
      console.log(`Local MongoDB Connected: ${localConn.connection.host}`);
      return localConn;
    } catch (localError) {
      console.error(`Local MongoDB connection error: ${localError.message}`);
      console.error('No MongoDB instance available. Please ensure MongoDB is running locally or check your Atlas connection.');
      // Don't exit the process, let the application continue without DB if needed for development
      throw new Error('Database connection failed');
    }
  }
};

module.exports = connectDB;