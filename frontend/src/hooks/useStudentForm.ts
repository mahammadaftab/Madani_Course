import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, StudentFormData } from '../validation/studentSchema';
import { studentService } from '../services/studentService';
import type { Student } from '../types';

interface UseStudentFormProps {
  student?: Student;
  onSuccess?: () => void;
}

export const useStudentForm = ({ student, onSuccess }: UseStudentFormProps = {}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student
      ? {
          name: student.name,
          phone: student.phone,
          age: student.age,
          district: student.district as any, // Type assertion to fix the issue
          address: student.address,
          coursePlace: student.coursePlace
        }
      : {
          name: '',
          phone: '',
          age: undefined, // No default age
          district: 'Belgaum' as any, // Type assertion to fix the issue
          address: '',
          coursePlace: ''
        }
  });

  const onSubmit = async (data: StudentFormData) => {
    try {
      if (student) {
        // Update existing student
        const response = await studentService.update(student._id, data);
        console.log('Student updated:', response.data);
      } else {
        // Create new student
        const response = await studentService.create(data);
        console.log('Student created:', response.data);
      }
      
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    reset
  };
};