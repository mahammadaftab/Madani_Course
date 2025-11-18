const mongoose = require('mongoose');

const examQuestionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: false,
    trim: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  marks: {
    type: Number,
    required: true,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExamQuestion', examQuestionSchema);