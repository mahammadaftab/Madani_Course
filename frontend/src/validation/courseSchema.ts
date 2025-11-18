import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  duration: z.string().min(1, 'Duration is required'),
  fees: z.number().min(0, 'Fees must be a positive number').optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;