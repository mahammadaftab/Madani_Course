import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Printer, Plus, Edit, Trash2, Users, MapPin, Phone, Calendar } from 'lucide-react';
import { studentService } from '../services/studentService';
import StudentForm from '../components/StudentForm';
import type { Student } from '../types';

const Students = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Fetch students with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['students', debouncedSearchTerm, selectedDistrict],
    queryFn: async () => {
      const response = await studentService.getAll({ 
        q: debouncedSearchTerm, 
        district: selectedDistrict === 'All' ? undefined : selectedDistrict 
      });
      return response;
    },
    // Don't refetch on window focus to reduce API calls
    refetchOnWindowFocus: false,
    // Only enable query when debounced term is set or we're fetching all students
    enabled: debouncedSearchTerm.length > 0 || (debouncedSearchTerm.length === 0 && selectedDistrict === 'All')
  });

  const students: Student[] = data?.data || [];

  // Filter students based on search term and district
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    
    return students.filter((student: Student) => {
      const matchesSearch = student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        student.phone.includes(debouncedSearchTerm) ||
        student.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesDistrict = selectedDistrict === 'All' || student.district === selectedDistrict;
      
      return matchesSearch && matchesDistrict;
    });
  }, [students, debouncedSearchTerm, selectedDistrict]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await studentService.delete(id);
      // Invalidate and refetch students
      queryClient.invalidateQueries({ queryKey: ['students'] });
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      // Get the current date for the print header
      const printDate = new Date().toLocaleDateString();
      
      // Determine the heading based on district filter
      const heading = selectedDistrict === 'All' ? 'Students List' : `Students List - ${selectedDistrict} District`;
      
      // Create the HTML content for printing
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Students List</title>
          <style>
            body {
              font-family: 'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif;
              margin: 20px;
              color: #000;
            }
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .print-header h1 {
              margin: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #333;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>${heading}</h1>
            <p>Printed on: ${printDate}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Address</th>
                <th>District</th>
                <th>Kaam</th>
              </tr>
            </thead>
            <tbody>
              ${filteredStudents.map((student: Student) => `
                <tr>
                  <td>
                    <div class="student-name">${student.name}</div>
                  </td>
                  <td>${student.age}</td>
                  <td>${student.phone}</td>
                  <td>${student.address}</td>
                  <td>${student.district}</td>
                  <td>${student.coursePlace}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      
      // Write the content to the print window
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait a bit for content to load, then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleFormSuccess = () => {
    // Invalidate and refetch students
    queryClient.invalidateQueries({ queryKey: ['students'] });
    setShowForm(false);
  };

  // Remove loading indicator completely
  if (isLoading) {
    // Don't show any loading indicator
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAyOGMwLTEuMS45LTIgMi0yaDE2YzEuMSAwIDItLjkgMi0yVjEyYzAtMS4xLS45LTItMi0yaC0xNmMtMS4xIDAtMiAuOS0yIDJ2MTR6IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0zMCAzMGMwLTEuMS45LTIgMi0yaDE2YzEuMSAwIDItLjkgMi0yVjE0YzAtMS4xLS45LTItMi0yaC0xNmMtMS4xIDAtMiAuOS0yIDJ2MTZ6IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0zMCAzMmMwLTEuMS45LTIgMi0yaDE2YzEuMSAwIDItLjkgMi0yVjE2YzAtMS4xLS45LTItMi0yaC0xNmMtMS4xIDAtMiAuOS0yIDJ2MTZ6IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and track all student registrations</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddStudent}
              className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </motion.button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-0">
          {/* Stats Cards - Show skeleton or empty state */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Districts</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none shadow-sm py-3 px-4 transition-all duration-300"
                    placeholder="Search students by name, phone, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none shadow-sm py-3 px-4 transition-all duration-300 bg-white"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option value="All">All Districts</option>
                  <option value="Belgaum">Belgaum</option>
                  <option value="Dharward">Dharward</option>
                  <option value="Bagalkot">Bagalkot</option>
                  <option value="Bijapur">Bijapur</option>
                  <option value="Gadag">Gadag</option>
                  <option value="Haveri">Haveri</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print List
            </motion.button>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      District
                    </th>
                    <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kaam
                    </th>
                    <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Show empty state while loading */}
                  <tr>
                    <td colSpan={7} className="table-cell text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-500">Loading students...</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Student Form Modal */}
        {showForm && (
          <StudentForm
            student={editingStudent || undefined}
            onClose={() => setShowForm(false)}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Students</h2>
          <p className="text-gray-700 mb-6">
            There was an error loading the students list. Please try again later.
          </p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['students'] })}
            className="btn-primary rounded-lg px-4 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAyOGMwLTEuMS45LTIgMi0yaDE2YzEuMSAwIDItLjkgMi0yVjEyYzAtMS4xLS45LTItMi0yaC0xNmMtMS4xIDAtMiAuOS0yIDJ2MTR6IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0zMCAzMGMwLTEuMS45LTIgMi0yaDE2YzEuMSAwIDItLjkgMi0yVjE0YzAtMS4xLS45LTItMi0yaC0xNmMtMS4xIDAtMiAuOS0yIDJ2MTZ6IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0zMCAzMmMwLTEuMS45LTIgMi0yaDE2YzEuMSAwIDItLjkgMi0yVjE2YzAtMS4xLS45LTItMi0yaC0xNmMtMS4xIDAtMiAuOS0yIDJ2MTZ6IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track all student registrations</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddStudent}
            className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </motion.button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-0">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Districts</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 w-full rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none shadow-sm py-3 px-4 transition-all duration-300"
                  placeholder="Search students by name, phone, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none shadow-sm py-3 px-4 transition-all duration-300 bg-white"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="All">All Districts</option>
                <option value="Belgaum">Belgaum</option>
                <option value="Dharward">Dharward</option>
                <option value="Bagalkot">Bagalkot</option>
                <option value="Bijapur">Bijapur</option>
                <option value="Gadag">Gadag</option>
                <option value="Haveri">Haveri</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print List
          </motion.button>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District
                  </th>
                  <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kaam
                  </th>
                  <th scope="col" className="table-header px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="table-cell text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-500">No students found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {debouncedSearchTerm ? 'Try adjusting your search criteria' : 'Get started by adding a new student'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student: Student) => (
                    <motion.tr 
                      key={student._id} 
                      className="hover:bg-gray-50 transition-colors duration-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="table-cell px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">Registered {new Date(student.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900">{student.age} years</div>
                        </div>
                      </td>
                      <td className="table-cell px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{student.phone}</div>
                        </div>
                      </td>
                      <td className="table-cell px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{student.address}</div>
                      </td>
                      <td className="table-cell px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                          <MapPin className="h-3 w-3 mr-1" />
                          {student.district}
                        </span>
                      </td>
                      <td className="table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.coursePlace}</div>
                      </td>
                      <td className="table-cell px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/students/${student._id}`)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                            title="View Details"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditStudent(student)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteStudent(student._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Student Form Modal */}
      {showForm && (
        <StudentForm
          student={editingStudent || undefined}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Students;