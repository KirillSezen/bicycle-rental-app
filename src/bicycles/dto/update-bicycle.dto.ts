import { IsString, Length, IsNumber, IsOptional } from 'class-validator';

export class UpdateBicycleDto {
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 20, { message: 'Не меньше 4 и не больше 20' })
  @IsOptional()
  model?: string;

  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 20, { message: 'Не меньше 4 и не больше 50' })
  @IsOptional()
  location?: string;

  @IsNumber({}, { message: 'Должно быть числом' })
  @IsOptional()
  pricePerHour?: number;
}
