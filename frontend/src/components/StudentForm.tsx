import React from 'react';
import { motion } from 'framer-motion';
import { useStudentForm } from '../hooks/useStudentForm';
import type { Student } from '../types';
import { User, Phone, Calendar, MapPin, Home, Briefcase } from 'lucide-react';

interface StudentFormProps {
  student?: Student;
  onClose: () => void;
  onSuccess?: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
  } = useStudentForm({
    student,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    }
  });

  // SVG pattern for background
  const backgroundPattern = (
    <svg width="100%" height="100%" className="absolute inset-0 z-0">
      <defs>
        <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="rgba(99, 102, 241, 0.1)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern)" />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 z-50">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {backgroundPattern}
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-2xl">
          <h2 className="text-3xl font-bold text-white">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <p className="text-indigo-100 mt-2">
            {student ? 'Update student information' : 'Register a new student in the system'}
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <User className="w-4 h-4 mr-2 text-indigo-500" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    {...register('name')}
                    className={`input-field pl-10 ${errors.name ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="Full name"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              {/* Phone */}
              <div className="relative">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-indigo-500" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    {...register('phone')}
                    className={`input-field pl-10 ${errors.phone ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="Phone number"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              
              {/* Age */}
              <div className="relative">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                  Age *
                </label>
                <div className="relative">
                  <input
                    id="age"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className={`input-field pl-10 ${errors.age ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="Age"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>
              
              {/* District */}
              <div className="relative">
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                  District
                </label>
                <div className="relative">
                  <select
                    id="district"
                    {...register('district')}
                    className={`input-field pl-10 ${errors.district ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                  >
                    <option value="">Select district</option>
                    <option value="Belgaum">Belgaum</option>
                    <option value="Dharward">Dharward</option>
                    <option value="Bagalkot">Bagalkot</option>
                    <option value="Bijapur">Bijapur</option>
                    <option value="Gadag">Gadag</option>
                    <option value="Haveri">Haveri</option>
                  </select>
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                )}
              </div>
              
              {/* Address */}
              <div className="md:col-span-2 relative">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Home className="w-4 h-4 mr-2 text-indigo-500" />
                  Address
                </label>
                <div className="relative">
                  <textarea
                    id="address"
                    {...register('address')}
                    rows={3}
                    className={`input-field pl-10 ${errors.address ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="Address"
                  />
                  <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
              
              {/* Kaam */}
              <div className="md:col-span-2 relative">
                <label htmlFor="coursePlace" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
                  Kaam *
                </label>
                <div className="relative">
                  <input
                    id="coursePlace"
                    {...register('coursePlace')}
                    className={`input-field pl-10 ${errors.coursePlace ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="Kaam"
                  />
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.coursePlace && (
                  <p className="mt-1 text-sm text-red-600">{errors.coursePlace.message}</p>
                )}
              </div>

            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : student ? 'Update Student' : 'Add Student'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentForm;