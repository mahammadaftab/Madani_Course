const Student = require('../models/Student');
const logger = require('../utils/logger');

const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    let filter = {};
    
    if (req.query.district) {
      filter.district = req.query.district;
    }
    
    if (req.query.q) {
      filter.$or = [
        { name: { $regex: req.query.q, $options: 'i' } },
        { phone: { $regex: req.query.q, $options: 'i' } },
        { address: { $regex: req.query.q, $options: 'i' } },
        { coursePlace: { $regex: req.query.q, $options: 'i' } }
      ];
    }
    
    const students = await Student.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const total = await Student.countDocuments(filter);
    
    logger.info(`Retrieved ${students.length} students (page ${page})`);
    
    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: students
    });
  } catch (error) {
    logger.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      logger.warn(`Student not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Student not found' });
    }
    
    logger.info(`Retrieved student: ${student.name} (${student._id})`);
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    logger.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    
    logger.info(`Created student: ${student.name} (${student._id})`);
    
    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    logger.error('Error creating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!student) {
      logger.warn(`Student not found for update: ${req.params.id}`);
      return res.status(404).json({ message: 'Student not found' });
    }
    
    logger.info(`Updated student: ${student.name} (${student._id})`);
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    logger.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      logger.warn(`Student not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: 'Student not found' });
    }
    
    logger.info(`Deleted student: ${student.name} (${student._id})`);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};