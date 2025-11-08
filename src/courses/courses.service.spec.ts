import { Level } from '@prisma/client';

import { CoursesService } from './courses.service';
import type { PrismaService } from '../prisma/prisma.service';
import type { CreateCourseDto } from './dto/create-course.dto';

// Minimal runtime stub for Nest imports used by CoursesService
jest.mock('@nestjs/common', () => ({
  NotFoundException: class NotFoundException extends Error {
    constructor(message?: string) {
      super(message);
      this.name = 'NotFoundException';
    }
  },
}));

describe('CoursesService', () => {
  let service: CoursesService;

  const mockPrismaService = {
    course: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(() => {
    service = new CoursesService(
      mockPrismaService as unknown as PrismaService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a course', async () => {
      const courseDto: CreateCourseDto = {
        title: 'Yoga Vinyasa',
        description: 'A dynamic yoga practice',
        price: 25,
        duration: 60,
        level: Level.ALL_LEVELS,
        capacity: 15,
      };

      const expectedCourse = { id: '1', ...courseDto };
      mockPrismaService.course.create.mockResolvedValue(expectedCourse);

      const result = await service.create(courseDto);
      expect(result).toEqual(expectedCourse);
      expect(mockPrismaService.course.create).toHaveBeenCalledWith({
        data: courseDto,
      });
    });
  });
});