const mongoose = require('mongoose');

const districtEnum = ['Belgaum', 'Dharward', 'Bagalkot', 'Bijapur', 'Gadag', 'Haveri'];

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  district: {
    type: String,
    required: true,
    enum: districtEnum
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  coursePlace: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);