import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { BicycleStatus } from 'src/generated/prisma/enums';

export const BICYCLE_SORT_FIELDS = ['status', 'location', 'pricePerHour'] as const;
export type BicycleSortField = (typeof BICYCLE_SORT_FIELDS)[number];

export class BicyclesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Должно быть числом' })
  @Min(1, { message: 'Минимум 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Должно быть числом' })
  @Min(1, { message: 'Минимум 1' })
  @Max(100, { message: 'Максимум 100' })
  limit: number = 10;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @MaxLength(20, { message: 'Максимальная длина 20' })
  model?: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @MaxLength(50, { message: 'Максимальная длина 50' })
  location?: string;

  @IsOptional()
  @IsEnum(BicycleStatus, {
    message: 'Некорректное значение status, доступные значения Available, Rented, Archive',
  })
  status?: BicycleStatus;

  @IsOptional()
  @IsIn(BICYCLE_SORT_FIELDS, {
    message: 'Некорректное значение sortBy, доступные значения status, location, pricePerHour',
  })
  sortBy?: BicycleSortField;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'asc';
}
