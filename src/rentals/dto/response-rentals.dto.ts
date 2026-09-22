import { ApiProperty } from '@nestjs/swagger';
import { RentalStatus } from 'src/generated/prisma/enums';

export class RentalResponseDto {
  @ApiProperty({
    example: '670e6722-h19b-41d4-a7f6-446643440000',
    description: 'Уникальный идентификатор аренды',
  })
  declare id: string;

  @ApiProperty({
    example: 'bfa6afb-аcf9-430a-9b74-8a3340f44dde',
    description: 'Уникальный идентификатор пользователя',
  })
  declare userId: string;

  @ApiProperty({
    example: 'bvn6afb-zcf4-220a-9b34-8a32130f44fbn',
    description: 'Уникальный идентификатор велосипеда',
  })
  declare bicycleId: string;

  @ApiProperty({
    example: '2026-10-22T16:10:00',
    description: 'Время начала аренды',
  })
  declare startTime: Date;

  @ApiProperty({
    example: '2026-10-22T16:30:00',
    description: 'Время конца аренды',
  })
  declare endTime: Date;

  @ApiProperty({
    example: 'Active',
    description: 'Статус аренды',
  })
  declare status: RentalStatus;

  @ApiProperty({
    example: '2026-09-21T16:12:20.887Z',
    description: 'время создания аренды',
  })
  declare createdAt: string;

  @ApiProperty({
    example: '2026-09-21T18:46:05.463Z',
    description: 'время обновления аренды',
  })
  declare updatedAt: string;
}
