const { body, validationResult } = require('express-validator');

// Validation rules for student creation/update
const studentValidationRules = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long')
      .trim(),
    
    body('phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .isLength({ min: 10 })
      .withMessage('Phone number must be at least 10 characters long')
      .trim(),
    
    body('age')
      .notEmpty()
      .withMessage('Age is required')
      .isInt({ min: 1, max: 120 })
      .withMessage('Age must be between 1 and 120'),
    
    body('district')
      .notEmpty()
      .withMessage('District is required')
      .isIn(['Belgaum', 'Dharward', 'Bagalkot', 'Bijapur', 'Gadag', 'Haveri'])
      .withMessage('Please select a valid district'),
    
    body('address')
      .notEmpty()
      .withMessage('Address is required')
      .isLength({ min: 5 })
      .withMessage('Address must be at least 5 characters long')
      .trim(),
    
    body('coursePlace')
      .notEmpty()
      .withMessage('Kaam is required')
      .trim()
  ];
};

// Validation rules for course creation/update
const courseValidationRules = () => {
  return [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3 })
      .withMessage('Title must be at least 3 characters long')
      .trim(),
    
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters long')
      .trim(),
    
    body('duration')
      .notEmpty()
      .withMessage('Duration is required')
      .trim(),
    
    body('fees')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Fees must be a positive number')
  ];
};

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  studentValidationRules,
  courseValidationRules,
  validate
};