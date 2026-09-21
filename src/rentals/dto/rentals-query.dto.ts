import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsIn, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { RentalStatus } from 'src/generated/prisma/enums';

export const RENTAL_SORT_FIELDS = ['startTime', 'status'] as const;
export type RentalSortField = (typeof RENTAL_SORT_FIELDS)[number];

export class RentalsQueryDto {
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
  @IsEnum(RentalStatus, {
    message: 'Некорректное значение status, доступные значения Active, Completed, Close',
  })
  status?: RentalStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Должно быть датой' })
  dateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Должно быть датой' })
  dateTo?: Date;

  @IsOptional()
  @IsIn(RENTAL_SORT_FIELDS, {
    message: 'Некорректное значение sortBy, доступные значения status, startTime',
  })
  sortBy: RentalSortField = 'startTime';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'desc';
}
