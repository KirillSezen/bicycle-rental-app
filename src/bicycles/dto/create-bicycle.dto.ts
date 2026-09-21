import { IsString, IsNotEmpty, Length, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { BicycleStatus } from 'src/generated/prisma/enums';

export class CreateBicycleDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @Length(4, 20, { message: 'Не меньше 4 и не больше 20' })
  declare model: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @Length(4, 50, { message: 'Не меньше 4 и не больше 50' })
  declare location: string;

  @IsEnum(BicycleStatus, {
    message: 'Некорректное значение status, доступные значения Available, Rented, Archive',
  })
  @IsOptional()
  status?: BicycleStatus;

  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsNumber({}, { message: 'Должно быть числом' })
  declare pricePerHour: number;
}
