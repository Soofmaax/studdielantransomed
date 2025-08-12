import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    // Check if course exists and has capacity
    const course = await this.prisma.course.findUnique({
      where: { id: createBookingDto.courseId },
      include: {
        bookings: {
          where: {
            date: createBookingDto.date,
            status: 'CONFIRMED',
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.bookings.length >= course.capacity) {
      throw new BadRequestException('Course is fully booked');
    }

    return this.prisma.booking.create({
      data: createBookingDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: true,
      },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: true,
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    try {
      return await this.prisma.booking.update({
        where: { id },
        data: updateBookingDto,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          course: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.booking.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }
}