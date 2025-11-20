import { z } from 'zod';

export const createBookingSchema = z.object({
  userId: z.string().min(1, 'userId requis'),
  courseId: z.string().min(1, 'courseId requis'),
  date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: 'date doit être une ISO date valide',
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  stripePaymentIntentId: z.string().min(1).optional(),
  paymentStatus: z.string().optional(),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: 'date doit être une ISO date valide',
  }).optional(),
});

export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;