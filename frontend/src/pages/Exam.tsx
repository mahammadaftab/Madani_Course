import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, RotateCcw, Printer, Award, BookOpen, FileText, Edit, Trash2, Save, Database } from 'lucide-react';
import type { ExamEntry, ExamQuestion } from '../types';
import { examQuestionService, examEntryService } from '../services/examQuestionService';
import { examRecordService } from '../services/examRecordService';

const Exam = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'exam'>('questions');
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  
  // Question management state
  const [topic, setTopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionMarks, setQuestionMarks] = useState(10);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  // Exam entry state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [coursePlace, setCoursePlace] = useState('');
  const [marks, setMarks] = useState<number[]>([]);
  const [topThree, setTopThree] = useState<ExamEntry[]>([]);
  
  // Loading and notification state
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  // Save exam state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({message, type});
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Save current exam as permanent record
  const saveExamRecord = async () => {
    if (!examTitle.trim()) {
      showNotification("Please enter a title for this exam record.", "error");
      return;
    }

    setLoading(true);
    
    try {
      const result = await examRecordService.saveExamRecord({
        title: examTitle.trim(),
        description: examDescription.trim() || undefined
      });
      
      showNotification(result.message, "success");
      setIsSaveModalOpen(false);
      setExamTitle('');
      setExamDescription('');
    } catch (error: any) {
      console.error('[Exam] Error saving exam record:', error);
      showNotification(error.response?.data?.message || "Failed to save exam record. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Load questions
        const questionsData = await examQuestionService.getQuestions();
        setQuestions(questionsData);
        setMarks(Array(questionsData.length).fill(0));
        
        // Load entries
        const entriesData = await examEntryService.getEntries();
        setEntries(entriesData);
      } catch (error) {
        console.error('[Exam] Error loading data:', error);
        showNotification('Failed to load data. Please try again.', "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle question form submission
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText) {
      showNotification("Please enter a question.", "error");
      return;
    }

    setLoading(true);
    
    try {
      if (editingQuestionId) {
        // Update existing question
        const updatedQuestion = await examQuestionService.updateQuestion(editingQuestionId, { 
          topic, 
          question: questionText, 
          marks: questionMarks 
        });
        
        setQuestions(questions.map(q => 
          q._id === editingQuestionId ? updatedQuestion : q
        ));
        setEditingQuestionId(null);
        showNotification("Question updated successfully!", "success");
      } else {
        // Add new question
        const newQuestion = await examQuestionService.createQuestion({ 
          topic, 
          question: questionText, 
          marks: questionMarks 
        });
        
        setQuestions([...questions, newQuestion]);
        showNotification("Question added successfully!", "success");
      }
      
      // Reset form (keep topic for continuity)
      setQuestionText('');
      setQuestionMarks(10);
    } catch (error) {
      console.error('[Exam] Error saving question:', error);
      showNotification("Failed to save question. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit a question
  const editQuestion = (question: ExamQuestion) => {
    setTopic(question.topic || '');
    setQuestionText(question.question);
    setQuestionMarks(question.marks);
    setEditingQuestionId(question._id || null);
  };

  // Delete a question
  const deleteQuestion = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setLoading(true);
      
      try {
        await examQuestionService.deleteQuestion(id);
        setQuestions(questions.filter(q => q._id !== id));
        showNotification("Question deleted successfully!", "success");
      } catch (error) {
        console.error('[Exam] Error deleting question:', error);
        showNotification("Failed to delete question. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle mark change for a specific question
  const handleMarkChange = (index: number, value: string) => {
    const newMarks = [...marks];
    newMarks[index] = parseInt(value) || 0;
    setMarks(newMarks);
  };

  // Add exam entry
  const addEntry = async () => {
    if (!name || !address || !coursePlace) {
      showNotification("Please fill all the required fields.", "error");
      return;
    }

    setLoading(true);
    
    try {
      const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);
      const maxPossibleMarks = questions.reduce((sum, q) => sum + q.marks, 0);
      const percentage = maxPossibleMarks > 0 ? (totalMarks / maxPossibleMarks) * 100 : 0;

      const newEntry = await examEntryService.createEntry({ 
        name, 
        phone, 
        address, 
        coursePlace, 
        marks, 
        percentage 
      });
      
      setEntries([newEntry, ...entries]); // Add to the beginning
      
      // Clear all input fields after adding the entry
      setName('');
      setPhone('');
      setAddress('');
      setCoursePlace('');
      setMarks(Array(questions.length).fill(0));
      
      showNotification("Entry added successfully!", "success");
    } catch (error) {
      console.error('[Exam] Error adding entry:', error);
      showNotification("Failed to add entry. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // New project - clear all entries
  const newProject = async () => {
    if (window.confirm("Are you sure you want to start a new project? This will clear all existing entries.")) {
      setLoading(true);
      
      try {
        // Delete all entries (keep questions)
        await examEntryService.deleteAllEntries();
        setEntries([]);
        showNotification("New project started! Previous entries cleared.", "success");
      } catch (error) {
        console.error('[Exam] Error clearing entries:', error);
        showNotification("Failed to clear entries. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Display top three students
  const displayTopThree = async () => {
    setLoading(true);
    
    try {
      const topEntries = await examEntryService.getTopEntries();
      setTopThree(topEntries);
    } catch (error) {
      console.error('[Exam] Error loading top entries:', error);
      showNotification("Failed to load top entries. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const printCombinedPage = async () => {
    await displayTopThree();

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print All Entries and Top 3 Students</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            h3 { text-align: center; margin-top: 30px; }
            .header { text-align: center; }
          </style>
        </head>
        <body>
          <h3 class="header">Dawat-E-Islami India<br><br> Namaz Course Exam - All Entries</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone No.</th>
                <th>Address</th>
                <th>Course Place</th>
                ${questions.map((_, index) => `<th>Q${index + 1}</th>`).join('')}
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(entry => `
                <tr>
                  <td>${entry.name}</td>
                  <td>${entry.phone}</td>
                  <td>${entry.address}</td>
                  <td>${entry.coursePlace}</td>
                  ${entry.marks.map((mark: number) => `<td>${mark}</td>`).join('')}
                  <td>${entry.percentage.toFixed(2)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h3 class="header">Top 3 Students</h3>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Phone No.</th>
                <th>Address</th>
                <th>Course Place</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              ${topThree.map((entry, index) => `
                <tr>
                  <td>${['1st', '2nd', '3rd'][index]}</td>
                  <td>${entry.name}</td>
                  <td>${entry.phone}</td>
                  <td>${entry.address}</td>
                  <td>${entry.coursePlace}</td>
                  <td>${entry.percentage.toFixed(2)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Group questions by topic for display in exam form
  const groupQuestionsByTopic = () => {
    const grouped: {topic: string | null, questions: ExamQuestion[]}[] = [];
    let currentGroup: {topic: string | null, questions: ExamQuestion[]} | null = null;
    
    questions.forEach(question => {
      // If there's a topic, start a new group
      if (question.topic) {
        // If we have an existing group with a different topic or no topic, push it
        if (currentGroup && (currentGroup.topic !== question.topic)) {
          grouped.push(currentGroup);
          currentGroup = null;
        }
        
        // If no current group or topic changed, create a new group
        if (!currentGroup) {
          currentGroup = { topic: question.topic, questions: [] };
        }
        
        currentGroup.questions.push(question);
      } else {
        // If no topic, add to current group or create a new group without topic
        if (!currentGroup) {
          currentGroup = { topic: null, questions: [] };
        }
        currentGroup.questions.push(question);
      }
    });
    
    // Push the last group if it exists
    if (currentGroup) {
      grouped.push(currentGroup);
    }
    
    return grouped;
  };

  // Show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0 z-0">
          <defs>
            <pattern id="exam-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="rgba(99, 102, 241, 0.1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#exam-pattern)" />
        </svg>
      </div>
      
      {/* Save Exam Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Database className="mr-2 h-5 w-5 text-green-600" />
                  Save Exam Record
                </h3>
                <button
                  onClick={() => setIsSaveModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Save this exam as a permanent record. You can access it later in the "All Records" section.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="exam-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    id="exam-title"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter exam title (e.g., Monthly Test - January 2024)"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="exam-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="exam-description"
                    value={examDescription}
                    onChange={(e) => setExamDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter exam description (optional)"
                    rows={3}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={saveExamRecord}
                  disabled={!examTitle.trim() || loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Record
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Notification popup */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center">
            <span className="font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Header with gradient */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Namaz Course Exam</h1>
            <p className="text-indigo-100 mt-1">Manage exam questions and student results</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'questions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="inline mr-2 h-4 w-4" />
              Course Questions
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'exam'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline mr-2 h-4 w-4" />
              Exam Entry
            </button>
          </nav>
        </div>

        {activeTab === 'questions' ? (
          /* Question Management Section */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add/Edit Question Form */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {editingQuestionId ? 'Edit Question' : 'Add New Question'}
              </h2>
              
              <form onSubmit={handleQuestionSubmit} className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                    Topic Headline (Optional)
                  </label>
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="input-field w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter topic headline (optional)"
                  />
                </div>
                
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                    Question *
                  </label>
                  <textarea
                    id="question"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="input-field w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter question"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">
                    Marks
                  </label>
                  <input
                    type="number"
                    id="marks"
                    value={questionMarks}
                    onChange={(e) => setQuestionMarks(parseInt(e.target.value) || 0)}
                    min="1"
                    className="input-field w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter marks"
                  />
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    disabled={loading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {editingQuestionId ? 'Update Question' : 'Add Question'}
                  </motion.button>
                  
                  {editingQuestionId && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setEditingQuestionId(null);
                        setTopic('');
                        setQuestionText('');
                        setQuestionMarks(10);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      disabled={loading}
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </form>
              
              {/* Save Questions Button - Removed as it's no longer needed */}
            </motion.div>
            
            {/* Questions List */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Questions List</h2>
              
              {questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">No questions added yet. Add your first question!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div key={question._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {question.topic && (
                            <div className="font-bold text-gray-900 bg-indigo-50 px-2 py-1 rounded inline-block mb-2">
                              {question.topic}
                            </div>
                          )}
                          <div className="mt-1 text-gray-700">{question.question}</div>
                          <div className="mt-2 text-sm text-gray-500 flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            Marks: {question.marks}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => editQuestion(question)}
                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                            disabled={loading}
                            title="Edit Question"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteQuestion(question._id || '')}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            disabled={loading}
                            title="Delete Question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          /* Exam Entry Section */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exam Entry Form */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Exam Entry Form</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter Student name here"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Phone Number:
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter Student phone number here"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter Student address here"
                  />
                </div>
                
                <div>
                  <label htmlFor="course-place" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Course Place:
                  </label>
                  <input
                    type="text"
                    id="course-place"
                    value={coursePlace}
                    onChange={(e) => setCoursePlace(e.target.value)}
                    className="input-field w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter course place here"
                  />
                </div>
              </div>

              {/* Dynamic Questions Section */}
              {questions.length > 0 ? (
                <div className="mt-8 space-y-6">
                  {groupQuestionsByTopic().map((group, groupIndex) => (
                    <div key={groupIndex} className="border border-gray-200 rounded-lg p-4">
                      {group.topic && (
                        <div className="font-bold text-lg mb-2 text-center text-indigo-700">{group.topic}</div>
                      )}
                      <div className="space-y-4">
                        {group.questions.map((question) => {
                          // Find the global index of this question
                          const globalIndex = questions.findIndex(q => q._id === question._id);
                          return (
                            <div key={question._id}>
                              <label className="block text-sm text-gray-700 mb-1">
                                {globalIndex + 1}) {question.question} ({question.marks} Marks)
                              </label>
                              <input
                                type="number"
                                value={marks[globalIndex] || ''}
                                onChange={(e) => handleMarkChange(globalIndex, e.target.value)}
                                className="input-field w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={`Mark ${globalIndex + 1}`}
                                max={question.marks}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-8 text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">No questions available. Please add questions in the "Manage Questions" tab.</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addEntry}
                  disabled={questions.length === 0 || loading}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg ${
                    questions.length === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                  }`}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSaveModalOpen(true)}
                  disabled={entries.length === 0 || loading}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg ${
                    entries.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Exam Record
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('questions')}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Edit Questions
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={newProject}
                  className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Project
                </motion.button>
              </div>

            </motion.div>

            {/* Results Section */}
            <div>
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">All Entries</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No.</th>
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Place</th>
                        {questions.map((_, index) => (
                          <th key={index} className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q{index + 1}</th>
                        ))}
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entries.map((entry) => (
                        <tr key={entry._id} className="hover:bg-gray-50">
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.name}</td>
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.phone}</td>
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.address}</td>
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.coursePlace}</td>
                          {entry.marks.map((mark: number, i: number) => (
                            <td key={i} className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900">{mark}</td>
                          ))}
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">{entry.percentage.toFixed(2)}%</td>
                        </tr>
                      ))}
                      {entries.length === 0 && (
                        <tr>
                          <td colSpan={4 + questions.length + 1} className="table-cell px-4 py-3 text-center text-sm text-gray-500">
                            No entries yet. Add some entries to see them here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={printCombinedPage}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    disabled={loading}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print All Entries & Top 3
                  </motion.button>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Top 3 Students</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={displayTopThree}
                    className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    disabled={loading}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Show Top 3
                  </motion.button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No.</th>
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Place</th>
                        <th className="table-header px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topThree.map((entry, index) => (
                        <tr key={entry._id} className="hover:bg-gray-50">
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{['1st', '2nd', '3rd'][index]}</td>
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.name}</td>
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.phone}</td>
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.address}</td>
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.coursePlace}</td>
                          <td className="table-cell px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">{entry.percentage.toFixed(2)}%</td>
                        </tr>
                      ))}
                      {topThree.length === 0 && (
                        <tr>
                          <td colSpan={6} className="table-cell px-4 py-3 text-center text-sm text-gray-500">
                            Click "Show Top 3" to display the top performing students.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Exam;