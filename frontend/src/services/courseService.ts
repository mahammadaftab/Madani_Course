import { apiClient } from './apiClient';
import type { Course } from '../types';

export interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  fees?: number;
}

// Remove the QuestionFormData interface since we're no longer using it
// export interface QuestionFormData {
//   text: string;
//   options: {
//     A: string;
//     B: string;
//     C: string;
//     D: string;
//   };
//   correctAnswer: 'A' | 'B' | 'C' | 'D';
// }

export const courseService = {
  // Get all courses
  getAll: () => {
    return apiClient.get<{
      success: boolean;
      count: number;
      data: Course[];
    }>('/courses');
  },

  // Get course by ID
  getById: (id: string) => {
    return apiClient.get<{
      success: boolean;
      data: Course;
    }>(`/courses/${id}`);
  },

  // Create new course
  create: (data: CourseFormData) => {
    return apiClient.post<{
      success: boolean;
      data: Course;
    }>('/courses', data);
  },

  // Update course
  update: (id: string, data: CourseFormData) => {
    return apiClient.put<{
      success: boolean;
      data: Course;
    }>(`/courses/${id}`, data);
  },

  // Delete course
  delete: (id: string) => {
    return apiClient.delete<{
      success: boolean;
      data: {};
    }>(`/courses/${id}`);
  }

  // Remove question-related functions since we're no longer using them
  // Add question to course
  // addQuestion: (courseId: string, question: QuestionFormData) => {
  //   return apiClient.post<{
  //     success: boolean;
  //     data: Course;
  //   }>(`/courses/${courseId}/questions`, question);
  // },

  // Update question in course
  // updateQuestion: (courseId: string, questionId: string, question: QuestionFormData) => {
  //   return apiClient.put<{
  //     success: boolean;
  //     data: Course;
  //   }>(`/courses/${courseId}/questions/${questionId}`, question);
  // },

  // Delete question from course
  // deleteQuestion: (courseId: string, questionId: string) => {
  //   return apiClient.delete<{
  //     success: boolean;
  //     data: Course;
  //   }>(`/courses/${courseId}/questions/${questionId}`);
  // }
};