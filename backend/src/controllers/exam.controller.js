const ExamQuestion = require('../models/ExamQuestion');
const ExamEntry = require('../models/ExamEntry');

// Exam Question Controllers
const createExamQuestion = async (req, res) => {
  try {
    const { topic, question, marks } = req.body;
    const examQuestion = new ExamQuestion({ topic, question, marks });
    await examQuestion.save();
    res.status(201).json(examQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getExamQuestions = async (req, res) => {
  try {
    const examQuestions = await ExamQuestion.find().sort({ createdAt: 1 });
    res.status(200).json(examQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExamQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { topic, question, marks } = req.body;
    const examQuestion = await ExamQuestion.findByIdAndUpdate(
      id,
      { topic, question, marks },
      { new: true, runValidators: true }
    );
    if (!examQuestion) {
      return res.status(404).json({ message: 'Exam question not found' });
    }
    res.status(200).json(examQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteExamQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const examQuestion = await ExamQuestion.findByIdAndDelete(id);
    if (!examQuestion) {
      return res.status(404).json({ message: 'Exam question not found' });
    }
    res.status(200).json({ message: 'Exam question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Exam Entry Controllers
const createExamEntry = async (req, res) => {
  try {
    const { name, phone, address, coursePlace, marks, percentage } = req.body;
    const examEntry = new ExamEntry({ name, phone, address, coursePlace, marks, percentage });
    await examEntry.save();
    res.status(201).json(examEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getExamEntries = async (req, res) => {
  try {
    const examEntries = await ExamEntry.find().sort({ createdAt: -1 });
    res.status(200).json(examEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopExamEntries = async (req, res) => {
  try {
    const examEntries = await ExamEntry.find().sort({ percentage: -1 }).limit(3);
    res.status(200).json(examEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExamEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const examEntry = await ExamEntry.findByIdAndDelete(id);
    if (!examEntry) {
      return res.status(404).json({ message: 'Exam entry not found' });
    }
    res.status(200).json({ message: 'Exam entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New project - delete all entries
const deleteAllExamEntries = async (req, res) => {
  try {
    await ExamEntry.deleteMany({});
    res.status(200).json({ message: 'All exam entries deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // Exam Question functions
  createExamQuestion,
  getExamQuestions,
  updateExamQuestion,
  deleteExamQuestion,
  // Exam Entry functions
  createExamEntry,
  getExamEntries,
  getTopExamEntries,
  deleteExamEntry,
  deleteAllExamEntries
};