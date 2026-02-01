import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Users, 
  BarChart3, 
  Eye, 
  Download, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Database,
  TrendingUp,
  Award,
  BookOpen,
  FileText
} from 'lucide-react';
import { examRecordService, type ExamRecord, type ExamRecordStats } from '../services/examRecordService';
import { useAuth } from '../hooks/useAuth';
import jsPDF from 'jspdf';

const AllRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [stats, setStats] = useState<ExamRecordStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('examDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<ExamRecord | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({message, type});
    setTimeout(() => setNotification(null), 3000);
  };

  // Load records
  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await examRecordService.getAllRecords(
        currentPage,
        10,
        searchTerm,
        sortBy,
        order
      );
      setRecords(response.records);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('[AllRecords] Error loading records:', error);
      showNotification('Failed to load records', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const statsData = await examRecordService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('[AllRecords] Error loading stats:', error);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    loadRecords();
    loadStats();
  }, [currentPage, searchTerm, sortBy, order]);

  // View record details
  const viewRecordDetails = async (recordId: string) => {
    try {
      const record = await examRecordService.getRecordById(recordId);
      setSelectedRecord(record);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('[AllRecords] Error loading record details:', error);
      showNotification('Failed to load record details', 'error');
    }
  };

  // Export record
  const exportRecord = async (recordId: string, title: string) => {
    try {
      const data = await examRecordService.exportRecord(recordId);
      
      // Create a simplified version without questions for export
      const simplifiedData = {
        examInfo: data.examInfo,
        entries: data.entries,
        // Skip questions as requested
      };
      
      // Ask user whether to download as PDF or JSON
      const exportChoice = window.confirm(`Do you want to download as PDF?\n\nClick "OK" for PDF or "Cancel" for JSON.`);
      
      if (exportChoice) {
        // Generate PDF with simplified data
        generatePdfReport(simplifiedData, title);
      } else {
        // Create and download JSON file without questions
        const blob = new Blob([JSON.stringify(simplifiedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exam-record-${title.replace(/\s+/g, '-').toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Record exported successfully', 'success');
      }
    } catch (error) {
      console.error('[AllRecords] Error exporting record:', error);
      showNotification('Failed to export record', 'error');
    }
  };

  // Generate PDF report for exam record
  const generatePdfReport = (data: any, title: string) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 105, 20, { align: 'center' });
    
    // Add subtitle
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    
    // Add basic info
    let yPos = 40;
    doc.setFontSize(14);
    doc.text('Exam Information', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Title: ${data.examInfo.title}`, 20, yPos);
    yPos += 8;
    doc.text(`Description: ${data.examInfo.description || 'N/A'}`, 20, yPos);
    yPos += 8;
    doc.text(`Date: ${new Date(data.examInfo.examDate).toLocaleDateString()}`, 20, yPos);
    yPos += 8;
    doc.text(`Total Students: ${data.examInfo.totalStudents}`, 20, yPos);
    yPos += 12;
    
    // Add statistics
    doc.setFontSize(14);
    doc.text('Statistics', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Passed: ${data.examInfo.statistics.passed}`, 20, yPos);
    yPos += 8;
    doc.text(`Failed: ${data.examInfo.statistics.failed}`, 20, yPos);
    yPos += 8;
    doc.text(`Grade Distribution:`, 20, yPos);
    yPos += 8;
    
    // Grade distribution
    for (const [grade, count] of Object.entries(data.examInfo.statistics.gradeDistribution)) {
      doc.text(`${grade}: ${count}`, 30, yPos);
      yPos += 6;
    }
    
    yPos += 10;
    
    // Skip questions section as requested
    
    yPos += 10;
    
    // Add results section
    doc.setFontSize(14);
    doc.text('Results', 20, yPos);
    yPos += 10;
    
    // Add results table header
    doc.setFontSize(10);
    doc.text('Rank', 20, yPos);
    doc.text('Name', 40, yPos);
    doc.text('Phone', 80, yPos);
    doc.text('Address', 100, yPos);
    doc.text('Course Place', 140, yPos);
    doc.text('Percentage', 180, yPos);
    yPos += 6;
    
    // Draw separator line
    doc.line(15, yPos - 2, 200, yPos - 2);
    
    // Add results data
    for (let i = 0; i < data.entries.length; i++) {
      const entry = data.entries[i];
      doc.setFontSize(9);
      doc.text(`#${entry.rank}`, 20, yPos);
      doc.text(entry.name.substring(0, 15), 40, yPos);
      doc.text(entry.phone?.substring(0, 10) || '-', 80, yPos);
      doc.text(entry.address.substring(0, 15), 100, yPos);
      doc.text(entry.coursePlace.substring(0, 15), 140, yPos);
      doc.text(`${entry.percentage.toFixed(2)}%`, 180, yPos);
      
      // Check if we need to add a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      } else {
        yPos += 6;
      }
    }
    
    // Save the PDF
    doc.save(`exam-record-${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    showNotification('PDF report generated successfully', 'success');
  };

  // Delete record (admin only)
  const deleteRecord = async (recordId: string, title: string) => {
    if (!user?.role?.includes('admin')) {
      showNotification('Only administrators can delete records', 'error');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the record "${title}"? This action cannot be undone.`)) {
      try {
        await examRecordService.deleteRecord(recordId);
        showNotification('Record deleted successfully', 'success');
        loadRecords();
        loadStats();
      } catch (error) {
        console.error('[AllRecords] Error deleting record:', error);
        showNotification('Failed to delete record', 'error');
      }
    }
  };

  // Print record details
  const printRecord = (record: ExamRecord) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${record.title} - Exam Record</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
            .grade-dist { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${record.title}</h1>
            <p>${record.description || 'Exam Record'}</p>
            <p><strong>Date:</strong> ${new Date(record.examDate).toLocaleDateString()}</p>
          </div>
          
          <div class="info-grid">
            <div class="info-box">
              <h3>Overview</h3>
              <p><strong>Total Students:</strong> ${record.totalStudents}</p>
              <p><strong>Average Score:</strong> ${record.averagePercentage.toFixed(2)}%</p>
              <p><strong>Highest Score:</strong> ${record.highestPercentage.toFixed(2)}%</p>
              <p><strong>Lowest Score:</strong> ${record.lowestPercentage.toFixed(2)}%</p>
            </div>
            <div class="info-box">
              <h3>Performance</h3>
              <p><strong>Passed:</strong> ${record.statistics.passed} students</p>
              <p><strong>Failed:</strong> ${record.statistics.failed} students</p>
              <p><strong>Pass Rate:</strong> ${((record.statistics.passed / record.totalStudents) * 100).toFixed(1)}%</p>
            </div>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <h3>A (${record.statistics.gradeDistribution['A'] || 0})</h3>
              <p>Excellent</p>
            </div>
            <div class="stat-card">
              <h3>B (${record.statistics.gradeDistribution['B'] || 0})</h3>
              <p>Good</p>
            </div>
            <div class="stat-card">
              <h3>C (${record.statistics.gradeDistribution['C'] || 0})</h3>
              <p>Average</p>
            </div>
            <div class="stat-card">
              <h3>D (${record.statistics.gradeDistribution['D'] || 0})</h3>
              <p>Pass</p>
            </div>
            <div class="stat-card">
              <h3>F (${record.statistics.gradeDistribution['F'] || 0})</h3>
              <p>Fail</p>
            </div>
          </div>
          
          <h2>Student Results</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Course Place</th>
                <th>Percentage</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              ${record.entries.map(entry => `
                <tr>
                  <td>${entry.rank}</td>
                  <td>${entry.name}</td>
                  <td>${entry.phone || '-'}</td>
                  <td>${entry.address}</td>
                  <td>${entry.coursePlace}</td>
                  <td>${entry.percentage.toFixed(2)}%</td>
                  <td>${getGrade(entry.percentage)}</td>
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

  // Helper function to determine grade
  const getGrade = (percentage: number) => {
    if (percentage >= 75) return 'A';
    if (percentage >= 60) return 'B';
    if (percentage >= 45) return 'C';
    if (percentage >= 35) return 'D';
    return 'F';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0 z-0">
          <defs>
            <pattern id="records-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="rgba(59, 130, 246, 0.3)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#records-pattern)" />
        </svg>
      </div>

      {/* Notification */}
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

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Database className="mr-3 h-8 w-8" />
                All Exam Records
              </h1>
              <p className="text-blue-100 mt-1">View and manage all saved exam records</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-medium">{stats?.totalRecords || 0} Records</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-amber-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averagePerformance.avgPercentage?.toFixed(1) || '0.0'}%
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center">
                <Award className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Highest Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averagePerformance.highestEver?.toFixed(1) || '0.0'}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search records by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="examDate">Date</option>
                <option value="title">Title</option>
                <option value="totalStudents">Students</option>
                <option value="averagePercentage">Average Score</option>
              </select>
            </div>
            
            <div>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading records...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="py-12 text-center">
              <Database className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No records found</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start by saving an exam from the Exam page'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Users className="inline h-4 w-4 mr-1" />
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <BarChart3 className="inline h-4 w-4 mr-1" />
                      Avg Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <motion.tr 
                      key={record._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.title}</div>
                        {record.description && (
                          <div className="text-sm text-gray-500 mt-1">{record.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.examDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.totalStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {record.averagePercentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.createdBy.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => viewRecordDetails(record._id)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => exportRecord(record._id, record.title)}
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                            title="Export"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {user?.role?.includes('admin') && (
                            <button
                              onClick={() => deleteRecord(record._id, record.title)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Record Detail Modal */}
      {isDetailModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="mr-3 h-6 w-6 text-blue-500" />
                {selectedRecord.title}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => generatePdfReport({
                    examInfo: {
                      title: selectedRecord.title,
                      description: selectedRecord.description,
                      examDate: selectedRecord.examDate,
                      totalStudents: selectedRecord.totalStudents,
                      statistics: selectedRecord.statistics
                    },
                    entries: selectedRecord.entries.map(entry => ({
                      rank: entry.rank,
                      name: entry.name,
                      phone: entry.phone,
                      address: entry.address,
                      coursePlace: entry.coursePlace,
                      marks: entry.marks,
                      percentage: entry.percentage,
                      grade: getGrade(entry.percentage)
                    }))
                  }, selectedRecord.title)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <FileText className="mr-2 h-4 w-4 inline" />
                  PDF Report
                </button>
                <button
                  onClick={() => printRecord(selectedRecord)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Print
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Exam Information</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Date:</strong> {new Date(selectedRecord.examDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Students:</strong> {selectedRecord.totalStudents}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Average:</strong> {selectedRecord.averagePercentage.toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Created by:</strong> {selectedRecord.createdBy.name}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Performance Statistics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-2xl font-bold text-green-600">{selectedRecord.statistics.passed}</p>
                      <p className="text-xs text-gray-600">Passed</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <p className="text-2xl font-bold text-red-600">{selectedRecord.statistics.failed}</p>
                      <p className="text-xs text-gray-600">Failed</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-2xl font-bold text-blue-600">{selectedRecord.highestPercentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">Highest</p>
                    </div>
                    <div className="text-center p-2 bg-amber-50 rounded">
                      <p className="text-2xl font-bold text-amber-600">{selectedRecord.lowestPercentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">Lowest</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Grade Distribution</h3>
                <div className="grid grid-cols-5 gap-3">
                  {['A', 'B', 'C', 'D', 'F'].map(grade => (
                    <div key={grade} className="text-center p-3 bg-white rounded border">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedRecord.statistics.gradeDistribution[grade] || 0}
                      </p>
                      <p className="text-sm font-medium text-gray-600">Grade {grade}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions List - HIDDEN per user request */}
              {/* <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Questions ({selectedRecord.questions.length})</h3>
                <div className="space-y-3">
                  {selectedRecord.questions.map((question, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      {question.topic && (
                        <div className="font-bold text-blue-700 mb-2">{question.topic}</div>
                      )}
                      <p className="text-gray-800 mb-2">{question.question}</p>
                      <p className="text-sm text-gray-500">Marks: {question.marks}</p>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Results Table */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Student Results ({selectedRecord.entries.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Place</th>
                        {selectedRecord.questions.map((_, qIndex) => (
                          <th key={qIndex} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Q{qIndex + 1}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedRecord.entries.map(entry => (
                        <tr key={entry._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{entry.rank}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.phone || '-'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.address}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.coursePlace}</td>
                          {entry.marks.map((mark, index) => (
                            <td key={index} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {mark}
                            </td>
                          ))}
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                            {entry.percentage.toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getGrade(entry.percentage) === 'A' ? 'bg-green-100 text-green-800' :
                              getGrade(entry.percentage) === 'B' ? 'bg-blue-100 text-blue-800' :
                              getGrade(entry.percentage) === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              getGrade(entry.percentage) === 'D' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {getGrade(entry.percentage)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AllRecords;