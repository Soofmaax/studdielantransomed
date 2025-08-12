```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Level } from '@prisma/client';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    course: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prisma = module.get<PrismaService>(PrismaService);
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
      expect(prisma.course.create).toHaveBeenCalledWith({
        data: courseDto,
      });
    });
  });
});
```