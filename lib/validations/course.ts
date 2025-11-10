import { z } from 'zod';

export const courseLevelEnum = z.enum([
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'ALL_LEVELS',
]);

export const createCourseSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.number().positive('Le prix doit être positif'),
  duration: z.number().int().positive('La durée doit être un entier positif'),
  level: courseLevelEnum,
  capacity: z.number().int().positive('La capacité doit être un entier positif'),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.partial();

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;