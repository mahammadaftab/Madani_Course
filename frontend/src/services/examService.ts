import { apiClient } from './apiClient';
import type { Exam } from '../types';

export interface ExamFormData {
  title: string;
  description: string;
  imageIds: string[];
}

export const examService = {
  // Get exam
  get: () => {
    return apiClient.get<{
      success: boolean;
      data: Exam;
    }>('/exam');
  },

  // Update exam
  update: (data: ExamFormData) => {
    return apiClient.put<{
      success: boolean;
      data: Exam;
    }>('/exam', data);
  },

  // Upload exam image
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiClient.upload<{
      success: boolean;
      data: {
        id: string;
        filename: string;
        url: string;
      };
    }>('/uploads', formData);
  }
};