const mongoose = require('mongoose');
const ExamRecord = require('../models/ExamRecord');
const ExamEntry = require('../models/ExamEntry');
const ExamQuestion = require('../models/ExamQuestion');
const User = require('../models/User');
require('dotenv').config();

const testExamRecord = async () => {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database successfully');

    // Create a test user if not exists
    let user = await User.findOne({ email: 'admin@test.com' });
    if (!user) {
      user = new User({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });
      await user.save();
      console.log('Test user created');
    }

    // Create test questions
    await ExamQuestion.deleteMany({});
    const questions = [
      { topic: 'Namaz Rules', question: 'What are the pillars of Islam?', marks: 10 },
      { topic: 'Namaz Rules', question: 'How many times should we pray daily?', marks: 10 },
      { topic: 'Quran', question: 'What is the first surah of Quran?', marks: 10 }
    ];
    
    for (const q of questions) {
      const question = new ExamQuestion(q);
      await question.save();
    }
    console.log('Test questions created');

    // Create test entries
    await ExamEntry.deleteMany({});
    const entries = [
      { name: 'Student One', phone: '1234567890', address: 'Test Address 1', coursePlace: 'Test Center', marks: [8, 9, 7], percentage: 80 },
      { name: 'Student Two', phone: '1234567891', address: 'Test Address 2', coursePlace: 'Test Center', marks: [6, 7, 8], percentage: 70 },
      { name: 'Student Three', phone: '1234567892', address: 'Test Address 3', coursePlace: 'Test Center', marks: [4, 5, 6], percentage: 50 }
    ];
    
    for (const e of entries) {
      const entry = new ExamEntry(e);
      await entry.save();
    }
    console.log('Test entries created');

    // Test creating exam record
    const [savedEntries, savedQuestions] = await Promise.all([
      ExamEntry.find().sort({ percentage: -1 }),
      ExamQuestion.find().sort({ createdAt: 1 })
    ]);

    const percentages = savedEntries.map(entry => entry.percentage);
    const totalStudents = savedEntries.length;
    const averagePercentage = percentages.reduce((sum, p) => sum + p, 0) / totalStudents;
    const highestPercentage = Math.max(...percentages);
    const lowestPercentage = Math.min(...percentages);
    
    const passingPercentage = 35;
    const passed = savedEntries.filter(entry => entry.percentage >= passingPercentage).length;
    const failed = totalStudents - passed;

    const gradeDistribution = new Map();
    savedEntries.forEach(entry => {
      let grade;
      if (entry.percentage >= 75) grade = 'A';
      else if (entry.percentage >= 60) grade = 'B';
      else if (entry.percentage >= 45) grade = 'C';
      else if (entry.percentage >= 35) grade = 'D';
      else grade = 'F';
      
      gradeDistribution.set(grade, (gradeDistribution.get(grade) || 0) + 1);
    });

    const entriesWithRank = savedEntries.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1
    }));

    const examRecord = new ExamRecord({
      title: 'Test Exam Record',
      description: 'This is a test exam record for verification',
      examDate: new Date(),
      totalStudents,
      averagePercentage,
      highestPercentage,
      lowestPercentage,
      questions: savedQuestions.map(q => ({
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
      createdBy: user._id
    });

    await examRecord.save();
    console.log('Exam record created successfully:', examRecord.title);

    // Test retrieving exam records
    const records = await ExamRecord.find().populate('createdBy', 'name email');
    console.log(`Found ${records.length} exam records:`);
    records.forEach(record => {
      console.log(`- ${record.title} (${record.totalStudents} students, avg: ${record.averagePercentage.toFixed(1)}%)`);
    });

    console.log('\n✅ All tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

testExamRecord();