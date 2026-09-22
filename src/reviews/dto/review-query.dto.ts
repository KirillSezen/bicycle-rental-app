import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class ReviewsQueryDto {
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
}
