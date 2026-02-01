import { apiClient } from './apiClient';

export interface ExamRecord {
  _id: string;
  title: string;
  description?: string;
  examDate: string;
  totalStudents: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  questions: {
    topic?: string;
    question: string;
    marks: number;
  }[];
  entries: {
    _id: string;
    name: string;
    phone?: string;
    address: string;
    coursePlace: string;
    marks: number[];
    percentage: number;
    rank: number;
  }[];
  statistics: {
    passed: number;
    failed: number;
    gradeDistribution: Record<string, number>;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExamRecordStats {
  totalRecords: number;
  totalStudents: number;
  averagePerformance: {
    avgPercentage: number;
    highestEver: number;
    lowestEver: number;
  };
}

export interface SaveExamRecordPayload {
  title: string;
  description?: string;
}

export interface ExamRecordListResponse {
  records: ExamRecord[];
  totalPages: number;
  currentPage: number;
  totalRecords: number;
}

class ExamRecordService {
  private baseUrl = '/exam-records';

  // Get all exam records with pagination and search
  async getAllRecords(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sortBy: string = 'examDate',
    order: 'asc' | 'desc' = 'desc'
  ): Promise<ExamRecordListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      sortBy,
      order
    });

    const response = await apiClient.get<ExamRecordListResponse>(
      `${this.baseUrl}?${params.toString()}`
    );
    return response;
  }

  // Get single exam record by ID
  async getRecordById(id: string): Promise<ExamRecord> {
    const response = await apiClient.get<ExamRecord>(`${this.baseUrl}/${id}`);
    return response;
  }

  // Save current exam as permanent record
  async saveExamRecord(payload: SaveExamRecordPayload): Promise<{ message: string; record: ExamRecord }> {
    const response = await apiClient.post<{ message: string; record: ExamRecord }>(
      `${this.baseUrl}/save`,
      payload
    );
    return response;
  }

  // Update exam record
  async updateRecord(id: string, payload: Partial<SaveExamRecordPayload>): Promise<{ message: string; record: ExamRecord }> {
    const response = await apiClient.put<{ message: string; record: ExamRecord }>(
      `${this.baseUrl}/${id}`,
      payload
    );
    return response;
  }

  // Delete exam record
  async deleteRecord(id: string): Promise<{ message: string; record: ExamRecord }> {
    const response = await apiClient.delete<{ message: string; record: ExamRecord }>(
      `${this.baseUrl}/${id}`
    );
    return response;
  }

  // Get statistics summary
  async getStats(): Promise<ExamRecordStats> {
    const response = await apiClient.get<ExamRecordStats>(`${this.baseUrl}/stats`);
    return response;
  }

  // Export exam record data
  async exportRecord(id: string): Promise<any> {
    const response = await apiClient.get<any>(`${this.baseUrl}/${id}/export`);
    return response;
  }
}

export const examRecordService = new ExamRecordService();
export default examRecordService;