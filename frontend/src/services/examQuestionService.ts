import { apiClient } from './apiClient';
import type { ExamQuestion, ExamEntry } from '../types';

export const examQuestionService = {
  // Get all exam questions
  getQuestions: () => {
    console.log('[ExamService] Getting exam questions');
    return apiClient.get<ExamQuestion[]>('/exam/questions');
  },

  // Create a new exam question
  createQuestion: (data: Partial<ExamQuestion>) => {
    console.log('[ExamService] Creating exam question', data);
    return apiClient.post<ExamQuestion>('/exam/questions', data);
  },

  // Update an exam question
  updateQuestion: (id: string, data: Partial<ExamQuestion>) => {
    console.log('[ExamService] Updating exam question', id, data);
    return apiClient.put<ExamQuestion>(`/exam/questions/${id}`, data);
  },

  // Delete an exam question
  deleteQuestion: (id: string) => {
    console.log('[ExamService] Deleting exam question', id);
    return apiClient.delete<{ message: string }>(`/exam/questions/${id}`);
  }
};

export const examEntryService = {
  // Get all exam entries
  getEntries: () => {
    console.log('[ExamService] Getting exam entries');
    return apiClient.get<ExamEntry[]>('/exam/entries');
  },

  // Get top 3 exam entries
  getTopEntries: () => {
    console.log('[ExamService] Getting top exam entries');
    return apiClient.get<ExamEntry[]>('/exam/entries/top');
  },

  // Create a new exam entry
  createEntry: (data: Partial<ExamEntry>) => {
    console.log('[ExamService] Creating exam entry', data);
    return apiClient.post<ExamEntry>('/exam/entries', data);
  },

  // Delete an exam entry
  deleteEntry: (id: string) => {
    console.log('[ExamService] Deleting exam entry', id);
    return apiClient.delete<{ message: string }>(`/exam/entries/${id}`);
  },

  // Delete all exam entries
  deleteAllEntries: () => {
    console.log('[ExamService] Deleting all exam entries');
    return apiClient.delete<{ message: string }>('/exam/entries');
  }
};