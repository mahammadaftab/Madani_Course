const mongoose = require('mongoose');

const examRecordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  examDate: {
    type: Date,
    default: Date.now
  },
  totalStudents: {
    type: Number,
    required: true
  },
  averagePercentage: {
    type: Number,
    required: true
  },
  highestPercentage: {
    type: Number,
    required: true
  },
  lowestPercentage: {
    type: Number,
    required: true
  },
  questions: [{
    topic: {
      type: String,
      trim: true
    },
    question: {
      type: String,
      required: true
    },
    marks: {
      type: Number,
      required: true
    }
  }],
  entries: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
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
    rank: {
      type: Number
    }
  }],
  statistics: {
    passed: {
      type: Number,
      default: 0
    },
    failed: {
      type: Number,
      default: 0
    },
    gradeDistribution: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
examRecordSchema.index({ title: 1 });
examRecordSchema.index({ examDate: -1 });
examRecordSchema.index({ createdBy: 1 });

module.exports = mongoose.model('ExamRecord', examRecordSchema);