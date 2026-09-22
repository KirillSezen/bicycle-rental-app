import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateRentalDto {
  @ApiProperty({
    example: 'bfa6afb-аcf9-430a-9b74-8a3340f44dde',
    description: 'Уникальный идентификатор пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  declare userId: string;

  @ApiProperty({
    example: 'bvn6afb-zcf4-220a-9b34-8a32130f44fbn',
    description: 'Уникальный идентификатор велосипеда',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  declare bicycleId: string;

  @ApiProperty({
    example: '2026-10-22T16:10:00',
    description: 'Время начала аренды',
  })
  @Type(() => Date)
  @IsDate({ message: 'Должно быть датой' })
  declare startTime: Date;

  @ApiProperty({
    example: '2026-10-22T16:30:00',
    description: 'Время конца аренды',
  })
  @Type(() => Date)
  @IsDate({ message: 'Должно быть датой' })
  declare endTime: Date;
}
