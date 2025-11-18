const mongoose = require('mongoose');

const examEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
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
  marks: {
    type: [Number],
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExamEntry', examEntrySchema);