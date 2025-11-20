import { useState, useRef, useEffect } from 'react';
import { Users, BookOpen, FileText, User, Key, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openChangePasswordModal = () => {
    setShowProfileDropdown(false);
    setShowPasswordModal(true);
    // Reset form fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Password changed successfully!');
        // Clear form fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Automatically logout after 2 seconds
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Password change error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { name: 'Add Student', href: '/students', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { name: 'Manage Courses', href: '/courses', icon: BookOpen, color: 'bg-green-100 text-green-600' },
    { name: 'Exam Section', href: '/exam', icon: FileText, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAyOGMwLTEuMS45LTIgMi0yaDE2YzEuMSAwIDItLjkgMi0yVjEyYzAtMS4xLS45LTItMi0yaC0xNmMtMS4xIDAtMiAuOS0yIDJ2MTR6IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0zMCAzMGMwLTEuMS45LTIgMi0yaDE2YzEuMSAwIDItLjkgMi0yVjE0YzAtMS4xLS45LTItMi0yaC0xNmMtMS4xIDAtMiAuOS0yIDJ2MTZ6IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0zMCAzMmMwLTEuMS45LTIgMi0yaDE2YzEuMSAwIDItLjkgMi0yVjE2YzAtMS4xLS45LTItMi0yaC0xNmMtMS4xIDAtMiAuOS0yIDJ2MTZ6IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      {/* Header 1 - Centered Image */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-center">
          <img 
            src="/green-logo.png" 
            alt="Logo" 
            className="h-12 w-auto"
          />
        </div>
      </header>
      
      {/* Header 2 - Left side content and right side admin button */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Left side - div with h1 and p */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Madani Course Department</h1>
            <p className="text-sm text-gray-500 mt-1">Mohammed Yaseer Attari</p>
          </div>
          
          {/* Right side - Admin button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <User className="h-4 w-4" />
              <span>Admin</span>
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200 overflow-hidden">
                <button
                  onClick={openChangePasswordModal}
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 w-full text-left transition-colors duration-200"
                >
                  <Key className="h-4 w-4 mr-3 text-indigo-600" />
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 w-full text-left transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-3 text-red-600" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-0">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 transition-all duration-300 hover:shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`flex-shrink-0 p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="mt-4 relative z-10">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-lg font-semibold text-gray-900">{action.name}</p>
                  <p className="text-sm text-gray-500 mt-1">Manage your {action.name.toLowerCase()}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Information Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Management</h2>
          <p className="text-gray-600 mb-5">
            Manage students, courses, and exams through the quick actions above.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-blue-900">Students</h3>
              <p className="text-sm text-blue-700 mt-1">Register and manage student information</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-medium text-green-900">Courses</h3>
              <p className="text-sm text-green-700 mt-1">Create and organize course content</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h3 className="font-medium text-purple-900">Exams</h3>
              <p className="text-sm text-purple-700 mt-1">Conduct assessments and track results</p>
            </div>
          </div>
        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                <button 
                  onClick={() => {
                    setShowPasswordModal(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input-field w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="btn-secondary px-4 py-2 rounded-lg"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;