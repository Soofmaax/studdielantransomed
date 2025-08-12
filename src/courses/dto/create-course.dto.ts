import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, Min, Max, Length } from 'class-validator';
import { Level } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'Yoga Vinyasa', description: 'The title of the course' })
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty({ example: 'A dynamic yoga practice...', description: 'Course description' })
  @IsString()
  @Length(10, 1000)
  description: string;

  @ApiProperty({ example: 25.00, description: 'Course price in EUR' })
  @IsNumber()
  @Min(0)
  @Max(1000)
  price: number;

  @ApiProperty({ example: 60, description: 'Course duration in minutes' })
  @IsNumber()
  @Min(15)
  @Max(180)
  duration: number;

  @ApiProperty({ enum: Level, example: Level.ALL_LEVELS })
  @IsEnum(Level)
  level: Level;

  @ApiProperty({ example: 15, description: 'Maximum number of participants' })
  @IsNumber()
  @Min(1)
  @Max(50)
  capacity: number;
}