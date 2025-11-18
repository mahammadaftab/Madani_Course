const express = require('express');
const Student = require('../models/Student');
const { exportStudentsToCSV } = require('../utils/csv.utils');
const { protect, admin } = require('../middleware/auth.middleware');
const logger = require('../utils/logger');

const router = express.Router();

// Export students to CSV
router.get('/export', protect, admin, async (req, res) => {
  try {
    // Get all students (in a real app, you might want to apply filters)
    const students = await Student.find().sort({ createdAt: -1 });
    
    // Generate CSV
    const csv = exportStudentsToCSV(students);
    
    // Set headers for CSV download
    res.header('Content-Type', 'text/csv');
    res.attachment('students.csv');
    
    logger.info(`Exported ${students.length} students to CSV`);
    
    return res.send(csv);
  } catch (error) {
    logger.error('Error exporting students to CSV:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;