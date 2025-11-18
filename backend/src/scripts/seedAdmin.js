const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const { hashPassword } = require('../utils/auth.utils');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: process.env.ADMIN_USERNAME });
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);

    // Create admin user
    const user = await User.create({
      email: process.env.ADMIN_USERNAME,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdminUser();