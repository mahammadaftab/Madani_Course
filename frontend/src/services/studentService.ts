import { apiClient } from './apiClient';
import { API_BASE_URL } from '../utils';
import type { Student } from '../types';

export interface StudentFormData {
  name: string;
  phone: string;
  age: number;
  district: string;
  address: string;
  coursePlace: string;
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  district?: string;
  q?: string;
}

export const studentService = {
  // Get all students with pagination and filters
  getAll: (params: StudentQueryParams) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.district) queryParams.append('district', params.district);
    if (params.q) queryParams.append('q', params.q);
    
    const queryString = queryParams.toString();
    const endpoint = `/students${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<{
      success: boolean;
      count: number;
      total: number;
      page: number;
      pages: number;
      data: Student[];
    }>(endpoint);
  },

  // Get student by ID
  getById: (id: string) => {
    return apiClient.get<{
      success: boolean;
      data: Student;
    }>(`/students/${id}`);
  },

  // Create new student
  create: (data: StudentFormData) => {
    return apiClient.post<{
      success: boolean;
      data: Student;
    }>('/students', data);
  },

  // Update student
  update: (id: string, data: StudentFormData) => {
    return apiClient.put<{
      success: boolean;
      data: Student;
    }>(`/students/${id}`, data);
  },

  // Delete student
  delete: (id: string) => {
    return apiClient.delete<{
      success: boolean;
      data: {};
    }>(`/students/${id}`);
  },

  // Export to CSV
  exportToCSV: async () => {
    try {
      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = `${API_BASE_URL.replace('/api', '')}/api/export/students`;
      link.download = 'students.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return Promise.reject(error);
    }
  },

  // Print students
  print: async () => {
    try {
      // In a real implementation, this would prepare data for printing
      // For now, we'll simulate the functionality
      console.log('Printing students');
      
      // Open print dialog
      window.print();
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error printing:', error);
      return Promise.reject(error);
    }
  }
};