import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { BicycleStatus } from 'src/generated/prisma/enums';

export const BICYCLE_SORT_FIELDS = ['status', 'location', 'pricePerHour'] as const;
export type BicycleSortField = (typeof BICYCLE_SORT_FIELDS)[number];

export class BicyclesQueryDto {
  @ApiProperty({ example: 1, description: 'номер страницы' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Должно быть числом' })
  @Min(1, { message: 'Минимум 1' })
  page: number = 1;

  @ApiProperty({ example: 10, description: 'лимит велосипедов на страницу' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Должно быть числом' })
  @Min(1, { message: 'Минимум 1' })
  @Max(100, { message: 'Максимум 100' })
  limit: number = 10;

  @ApiProperty({ example: 'vx-452', description: 'модель велосипеда' })
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @MaxLength(20, { message: 'Максимальная длина 20' })
  model?: string;

  @ApiProperty({ example: 'Moscow', description: 'местоположение велосипеда' })
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @MaxLength(50, { message: 'Максимальная длина 50' })
  location?: string;

  @ApiProperty({ example: 'Available', description: 'статус велосипеда' })
  @IsOptional()
  @IsEnum(BicycleStatus, {
    message: 'Некорректное значение status, доступные значения Available, Rented, Archive',
  })
  status?: BicycleStatus;

  @ApiProperty({ example: 'status', description: 'параметр сортировки велосипеда' })
  @IsOptional()
  @IsIn(BICYCLE_SORT_FIELDS, {
    message: 'Некорректное значение sortBy, доступные значения status, location, pricePerHour',
  })
  sortBy?: BicycleSortField;

  @ApiProperty({ example: 'asc', description: 'порядок сортировки' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'asc';
}
