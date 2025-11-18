const express = require('express');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/student.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { studentValidationRules, validate } = require('../middleware/validation.middleware');

const router = express.Router();

router.route('/')
  .get(protect, getStudents)
  .post(protect, admin, studentValidationRules(), validate, createStudent);

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, admin, studentValidationRules(), validate, updateStudent)
  .delete(protect, admin, deleteStudent);

module.exports = router;