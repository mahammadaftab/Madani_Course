const Course = require('../models/Course');
const logger = require('../utils/logger');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    
    logger.info(`Retrieved ${courses.length} courses`);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    logger.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      logger.warn(`Course not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Course not found' });
    }
    
    logger.info(`Retrieved course: ${course.title} (${course._id})`);
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    logger.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    
    logger.info(`Created course: ${course.title} (${course._id})`);
    
    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    logger.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!course) {
      logger.warn(`Course not found for update: ${req.params.id}`);
      return res.status(404).json({ message: 'Course not found' });
    }
    
    logger.info(`Updated course: ${course.title} (${course._id})`);
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    logger.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      logger.warn(`Course not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: 'Course not found' });
    }
    
    logger.info(`Deleted course: ${course.title} (${course._id})`);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove question-related functions since we're no longer using them
// const addQuestion = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     
//     if (!course) {
//       logger.warn(`Course not found: ${req.params.id}`);
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     
//     // Add the new question to the course
//     course.questions.push(req.body);
//     await course.save();
//     
//     logger.info(`Added question to course: ${course.title} (${course._id})`);
//     
//     res.status(200).json({
//       success: true,
//       data: course
//     });
//   } catch (error) {
//     logger.error('Error adding question to course:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const updateQuestion = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     
//     if (!course) {
//       logger.warn(`Course not found: ${req.params.id}`);
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     
//     // Find the question index
//     const questionIndex = course.questions.findIndex(
//       q => q._id.toString() === req.params.questionId
//     );
//     
//     if (questionIndex === -1) {
//       logger.warn(`Question not found: ${req.params.questionId}`);
//       return res.status(404).json({ message: 'Question not found' });
//     }
//     
//     // Update the question
//     course.questions[questionIndex] = {
//       ...course.questions[questionIndex]._doc,
//       ...req.body
//     };
//     
//     await course.save();
//     
//     logger.info(`Updated question in course: ${course.title} (${course._id})`);
//     
//     res.status(200).json({
//       success: true,
//       data: course
//     });
//   } catch (error) {
//     logger.error('Error updating question in course:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const deleteQuestion = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     
//     if (!course) {
//       logger.warn(`Course not found: ${req.params.id}`);
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     
//     // Find the question index
//     const questionIndex = course.questions.findIndex(
//       q => q._id.toString() === req.params.questionId
//     );
//     
//     if (questionIndex === -1) {
//       logger.warn(`Question not found: ${req.params.questionId}`);
//       return res.status(404).json({ message: 'Question not found' });
//     }
//     
//     // Remove the question
//     course.questions.splice(questionIndex, 1);
//     await course.save();
//     
//     logger.info(`Deleted question from course: ${course.title} (${course._id})`);
//     
//     res.status(200).json({
//       success: true,
//       data: course
//     });
//   } catch (error) {
//     logger.error('Error deleting question from course:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
  // Remove question-related exports since we're no longer using them
  // addQuestion,
  // updateQuestion,
  // deleteQuestion
};