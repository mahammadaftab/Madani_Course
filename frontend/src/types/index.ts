export interface Student {
  _id: string;
  name: string;
  phone: string;
  age: number;
  district: string;
  address: string;
  coursePlace: string;
  createdAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  fees?: number;
  createdAt: string;
  updatedAt: string;
}

// Remove the Question interface since we're no longer using it
// export interface Question {
//   _id?: string;
//   text: string;
//   options: {
//     A: string;
//     B: string;
//     C: string;
//     D: string;
//   };
//   correctAnswer: 'A' | 'B' | 'C' | 'D';
// }

export interface ExamQuestion {
  _id?: string;
  topic: string;
  question: string;
  marks: number;
  createdAt?: string;
}

export interface ExamEntry {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  coursePlace: string;
  marks: number[];
  percentage: number;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  role?: string;
}

export interface Exam {
  _id: string;
  title: string;
  description: string;
  imageIds: string[];
  createdAt: string;
  updatedAt: string;
}