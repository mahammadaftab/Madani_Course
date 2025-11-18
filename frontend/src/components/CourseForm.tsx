import React from 'react';
import { motion } from 'framer-motion';
import { useCourseForm } from '../hooks/useCourseForm';
import type { Course } from '../types';

interface CourseFormProps {
  course?: Course;
  onClose: () => void;
  onSuccess?: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
  } = useCourseForm({
    course,
    onSuccess: () => {
      onSuccess?.();
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <input
                  id="title"
                  {...register('title')}
                  className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Enter course title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={4}
                  className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Enter course description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              
              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <input
                  id="duration"
                  {...register('duration')}
                  className={`input-field ${errors.duration ? 'border-red-500' : ''}`}
                  placeholder="Enter course duration (e.g., 3 months)"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>
              
              {/* Fees */}
              <div>
                <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-1">
                  Fees (Optional)
                </label>
                <input
                  id="fees"
                  type="number"
                  step="0.01"
                  {...register('fees', { valueAsNumber: true })}
                  className={`input-field ${errors.fees ? 'border-red-500' : ''}`}
                  placeholder="Enter course fees"
                />
                {errors.fees && (
                  <p className="mt-1 text-sm text-red-600">{errors.fees.message}</p>
                )}
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-8">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Saving...' : course ? 'Update Course' : 'Add Course'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseForm;