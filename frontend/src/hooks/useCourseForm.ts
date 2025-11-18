import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, CourseFormData } from '../validation/courseSchema';
import { courseService } from '../services/courseService';
import type { Course } from '../types';

interface UseCourseFormProps {
  course?: Course;
  onSuccess?: (data?: Course) => void;
}

export const useCourseForm = ({ course, onSuccess }: UseCourseFormProps = {}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          title: course.title,
          description: course.description,
          duration: course.duration,
          fees: course.fees
        }
      : {
          title: '',
          description: '',
          duration: '',
          fees: undefined
        }
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      let result;
      if (course && course._id) {
        // Update existing course
        result = await courseService.update(course._id, data);
      } else {
        // Create new course
        result = await courseService.create(data);
      }
      reset();
      onSuccess?.(result.data);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    reset,
    control
  };
};