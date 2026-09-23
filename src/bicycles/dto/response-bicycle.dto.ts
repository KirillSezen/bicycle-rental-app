import { ApiProperty } from '@nestjs/swagger';
import { BicycleStatus } from 'src/generated/prisma/enums';

export class BicycleResponseDto {
  @ApiProperty({
    example: '670e6722-h19b-41d4-a7f6-446643440000',
    description: 'Уникальный идентификатор',
  })
  declare id: string;

  @ApiProperty({ example: 'vx-452', description: 'модель велосипеда' })
  declare model: string;

  @ApiProperty({ example: 'Moscow', description: 'местоположение велосипеда' })
  declare location: string;

  @ApiProperty({ example: 'Available', description: 'статус велосипеда' })
  declare status: BicycleStatus;

  @ApiProperty({ example: 5, description: 'почасовая стоимость аренды велосипеда' })
  declare pricePerHour: number;

  @ApiProperty({
    example: '2026-09-21T16:12:20.887Z',
    description: 'время создания велосипеда',
  })
  declare createdAt: string;

  @ApiProperty({
    example: '2026-09-21T18:46:05.463Z',
    description: 'время обновления велосипеда',
  })
  declare updatedAt: string;
}
