import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateRentalDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  declare userId: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  declare bicycleId: string;

  @Type(() => Date)
  @IsDate({ message: 'Должно быть датой' })
  declare startTime: Date;

  @Type(() => Date)
  @IsDate({ message: 'Должно быть датой' })
  declare endTime: Date;
}
