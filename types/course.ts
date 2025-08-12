import { Level } from '@prisma/client';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  level: Level;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}