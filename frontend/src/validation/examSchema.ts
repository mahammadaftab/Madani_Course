import { z } from 'zod';

export const examSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().optional(),
  imageIds: z.array(z.string()).optional()
});

export type ExamFormData = z.infer<typeof examSchema>;