import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { BicycleStatus } from 'src/generated/prisma/enums';

export class CreateBicycleDto {
  @ApiProperty({ example: 'vx-452', description: 'модель велосипеда' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @Length(4, 20, { message: 'Не меньше 4 и не больше 20' })
  declare model: string;

  @ApiProperty({ example: 'Moscow', description: 'местоположение велосипеда' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @Length(4, 50, { message: 'Не меньше 4 и не больше 50' })
  declare location: string;

  @ApiProperty({ example: 'Available', description: 'статус велосипеда' })
  @IsEnum(BicycleStatus, {
    message: 'Некорректное значение status, доступные значения Available, Rented, Archive',
  })
  @IsOptional()
  status?: BicycleStatus;

  @ApiProperty({ example: 5, description: 'почасовая стоимость аренды велосипеда' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsNumber({}, { message: 'Должно быть числом' })
  declare pricePerHour: number;
}
