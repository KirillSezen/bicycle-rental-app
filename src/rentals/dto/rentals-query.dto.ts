import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsIn, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { RentalStatus } from 'src/generated/prisma/enums';

export const RENTAL_SORT_FIELDS = ['startTime', 'status'] as const;
export type RentalSortField = (typeof RENTAL_SORT_FIELDS)[number];

export class RentalsQueryDto {
  @ApiProperty({ example: 1, description: 'номер страницы' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Должно быть числом' })
  @Min(1, { message: 'Минимум 1' })
  page: number = 1;

  @ApiProperty({ example: 10, description: 'лимит аренд на страницу' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Должно быть числом' })
  @Min(1, { message: 'Минимум 1' })
  @Max(100, { message: 'Максимум 100' })
  limit: number = 10;

  @ApiProperty({ example: 'Active', description: 'статус аренды' })
  @IsOptional()
  @IsEnum(RentalStatus, {
    message: 'Некорректное значение status, доступные значения Active, Completed, Close',
  })
  status?: RentalStatus;

  @ApiProperty({ example: 'Active', description: 'от какой даты' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Должно быть датой' })
  dateFrom?: Date;

  @ApiProperty({ example: 'Active', description: 'до какой даты' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Должно быть датой' })
  dateTo?: Date;

  @ApiProperty({ example: 'status', description: 'параметр сортировки аренды' })
  @IsOptional()
  @IsIn(RENTAL_SORT_FIELDS, {
    message: 'Некорректное значение sortBy, доступные значения status, startTime',
  })
  sortBy: RentalSortField = 'startTime';

  @ApiProperty({ example: 'asc', description: 'порядок сортировки' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'desc';
}
