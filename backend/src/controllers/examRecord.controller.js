const ExamRecord = require('../models/ExamRecord');
const ExamEntry = require('../models/ExamEntry');
const ExamQuestion = require('../models/ExamQuestion');
const User = require('../models/User');

// Get all exam records
const getAllExamRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'examDate', order = 'desc' } = req.query;
    
    const query = search 
      ? { 
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const records = await ExamRecord.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email');

    const total = await ExamRecord.countDocuments(query);

    res.status(200).json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalRecords: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single exam record by ID
const getExamRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await ExamRecord.findById(id)
      .populate('createdBy', 'name email');
    
    if (!record) {
      return res.status(404).json({ message: 'Exam record not found' });
    }
    
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save current exam as permanent record
const saveExamRecord = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Check if title already exists
    const existingRecord = await ExamRecord.findOne({ title });
    if (existingRecord) {
      return res.status(400).json({ message: 'An exam record with this title already exists' });
    }

    // Get current exam entries and questions
    const [entries, questions] = await Promise.all([
      ExamEntry.find().sort({ percentage: -1 }),
      ExamQuestion.find().sort({ createdAt: 1 })
    ]);

    if (entries.length === 0) {
      return res.status(400).json({ message: 'No exam entries found to save' });
    }

    // Calculate statistics
    const percentages = entries.map(entry => entry.percentage);
    const totalStudents = entries.length;
    const averagePercentage = percentages.reduce((sum, p) => sum + p, 0) / totalStudents;
    const highestPercentage = Math.max(...percentages);
    const lowestPercentage = Math.min(...percentages);
    
    // Calculate pass/fail statistics (assuming 35% is passing)
    const passingPercentage = 35;
    const passed = entries.filter(entry => entry.percentage >= passingPercentage).length;
    const failed = totalStudents - passed;

    // Calculate grade distribution
    const gradeDistribution = new Map();
    entries.forEach(entry => {
      let grade;
      if (entry.percentage >= 75) grade = 'A';
      else if (entry.percentage >= 60) grade = 'B';
      else if (entry.percentage >= 45) grade = 'C';
      else if (entry.percentage >= 35) grade = 'D';
      else grade = 'F';
      
      gradeDistribution.set(grade, (gradeDistribution.get(grade) || 0) + 1);
    });

    // Add rank to entries
    const entriesWithRank = entries.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1
    }));

    // Create exam record
    const examRecord = new ExamRecord({
      title,
      description,
      examDate: new Date(),
      totalStudents,
      averagePercentage,
      highestPercentage,
      lowestPercentage,
      questions: questions.map(q => ({
        topic: q.topic,
        question: q.question,
        marks: q.marks
      })),
      entries: entriesWithRank,
      statistics: {
        passed,
        failed,
        gradeDistribution: Object.fromEntries(gradeDistribution)
      },
      createdBy: userId
    });

    await examRecord.save();

    res.status(201).json({
      message: 'Exam record saved successfully',
      record: examRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update exam record
const updateExamRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const record = await ExamRecord.findByIdAndUpdate(
      id,
      { title, description, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Exam record not found' });
    }

    res.status(200).json({
      message: 'Exam record updated successfully',
      record
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete exam record (soft delete for permanent records)
const deleteExamRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    const record = await ExamRecord.findByIdAndDelete(id);
    
    if (!record) {
      return res.status(404).json({ message: 'Exam record not found' });
    }

    res.status(200).json({ 
      message: 'Exam record deleted successfully',
      record
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get statistics summary
const getExamRecordStats = async (req, res) => {
  try {
    const totalRecords = await ExamRecord.countDocuments();
    const totalStudents = await ExamRecord.aggregate([
      { $group: { _id: null, total: { $sum: "$totalStudents" } } }
    ]);
    
    const avgPerformance = await ExamRecord.aggregate([
      { $group: { 
          _id: null, 
          avgPercentage: { $avg: "$averagePercentage" },
          highestEver: { $max: "$highestPercentage" },
          lowestEver: { $min: "$lowestPercentage" }
        } 
      }
    ]);

    res.status(200).json({
      totalRecords: totalRecords,
      totalStudents: totalStudents[0]?.total || 0,
      averagePerformance: avgPerformance[0] || {}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export exam record data
const exportExamRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await ExamRecord.findById(id);
    
    if (!record) {
      return res.status(404).json({ message: 'Exam record not found' });
    }

    // Format data for export
    const exportData = {
      examInfo: {
        title: record.title,
        description: record.description,
        examDate: record.examDate,
        totalStudents: record.totalStudents,
        statistics: record.statistics
      },
      questions: record.questions,
      entries: record.entries.map(entry => ({
        rank: entry.rank,
        name: entry.name,
        phone: entry.phone,
        address: entry.address,
        coursePlace: entry.coursePlace,
        marks: entry.marks,
        percentage: entry.percentage,
        grade: getGrade(entry.percentage)
      }))
    };

    res.status(200).json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to determine grade
const getGrade = (percentage) => {
  if (percentage >= 75) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 45) return 'C';
  if (percentage >= 35) return 'D';
  return 'F';
};

module.exports = {
  getAllExamRecords,
  getExamRecordById,
  saveExamRecord,
  updateExamRecord,
  deleteExamRecord,
  getExamRecordStats,
  exportExamRecord
};