import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNumber, IsOptional } from 'class-validator';

export class UpdateBicycleDto {
  @ApiProperty({ example: 'vx-452', description: 'модель велосипеда' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 20, { message: 'Не меньше 4 и не больше 20' })
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 'Moscow', description: 'местоположение велосипеда' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 20, { message: 'Не меньше 4 и не больше 50' })
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 5, description: 'почасовая стоимость аренды велосипеда' })
  @IsNumber({}, { message: 'Должно быть числом' })
  @IsOptional()
  pricePerHour?: number;
}
