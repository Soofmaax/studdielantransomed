import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty({ example: 'user-id', description: 'ID of the user making the booking' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'course-id', description: 'ID of the course being booked' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: '2025-01-15T10:00:00Z', description: 'Date and time of the booking' })
  @IsDateString()
  date: Date;

  @ApiProperty({ enum: Status, example: Status.PENDING })
  @IsEnum(Status)
  status: Status;
}