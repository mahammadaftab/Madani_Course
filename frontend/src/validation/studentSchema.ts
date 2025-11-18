import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long'),
  age: z.number().min(1, 'Age must be at least 1 year').max(120, 'Age must be realistic'),
  district: z.enum(['Belgaum', 'Dharward', 'Bagalkot', 'Bijapur', 'Gadag', 'Haveri']).refine(val => val !== undefined, {
    message: 'Please select a district'
  }),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
  coursePlace: z.string().min(1, 'Kaam is required'),
});

export type StudentFormData = z.infer<typeof studentSchema>;