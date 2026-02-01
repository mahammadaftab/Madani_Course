const express = require('express');
const router = express.Router();
const { 
  getAllExamRecords,
  getExamRecordById,
  saveExamRecord,
  updateExamRecord,
  deleteExamRecord,
  getExamRecordStats,
  exportExamRecord
} = require('../controllers/examRecord.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Get all exam records with pagination and search
router.get('/', getAllExamRecords);

// Get statistics summary
router.get('/stats', getExamRecordStats);

// Save current exam as permanent record
router.post('/save', saveExamRecord);

// Get single exam record
router.get('/:id', getExamRecordById);

// Export exam record data
router.get('/:id/export', exportExamRecord);

// Update exam record (admin only)
router.put('/:id', admin, updateExamRecord);

// Delete exam record (admin only)
router.delete('/:id', admin, deleteExamRecord);

module.exports = router;