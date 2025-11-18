const express = require('express');
const router = express.Router();
const { 
  createExamQuestion,
  getExamQuestions,
  updateExamQuestion,
  deleteExamQuestion,
  createExamEntry,
  getExamEntries,
  getTopExamEntries,
  deleteExamEntry,
  deleteAllExamEntries
} = require('../controllers/exam.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Exam Question routes
router.route('/questions')
  .post(protect, admin, createExamQuestion)
  .get(protect, getExamQuestions);

router.route('/questions/:id')
  .put(protect, admin, updateExamQuestion)
  .delete(protect, admin, deleteExamQuestion);

// Exam Entry routes
router.route('/entries')
  .post(protect, admin, createExamEntry)
  .get(protect, getExamEntries)
  .delete(protect, admin, deleteAllExamEntries);

router.route('/entries/top')
  .get(protect, getTopExamEntries);

router.route('/entries/:id')
  .delete(protect, admin, deleteExamEntry);

module.exports = router;