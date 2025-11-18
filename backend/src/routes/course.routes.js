const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
  // Remove question-related functions since we're no longer using them
  // addQuestion,
  // updateQuestion,
  // deleteQuestion
} = require('../controllers/course.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { courseValidationRules, validate } = require('../middleware/validation.middleware');

const router = express.Router();

router.route('/')
  .get(protect, getCourses)
  .post(protect, admin, courseValidationRules(), validate, createCourse);

router.route('/:id')
  .get(protect, getCourseById)
  .put(protect, admin, courseValidationRules(), validate, updateCourse)
  .delete(protect, admin, deleteCourse);

// Remove question routes since we're no longer using them
// router.route('/:id/questions')
//   .post(protect, admin, addQuestion);

// router.route('/:id/questions/:questionId')
//   .put(protect, admin, updateQuestion)
//   .delete(protect, admin, deleteQuestion);

module.exports = router;