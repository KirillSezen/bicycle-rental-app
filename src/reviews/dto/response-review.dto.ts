import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({
    example: '670e6722-h19b-41d4-a7f6-446643440000',
    description: 'Уникальный идентификатор отзыва',
  })
  declare id: string;

  @ApiProperty({
    example: 4,
    description: 'Рейтинг отзыва',
  })
  declare rating: number;

  @ApiProperty({
    example: 'Nice one !',
    description: 'Комментарий отзыва',
  })
  declare comment: string;

  @ApiProperty({
    example: '2026-09-21T16:12:20.887Z',
    description: 'время создания отзыва',
  })
  declare createdAt: string;

  @ApiProperty({
    example: '2026-09-21T18:46:05.463Z',
    description: 'время обновления отзыва',
  })
  declare updatedAt: string;

  @ApiProperty({
    example: '670e5v22-3b4b-21d4-a7f6-4zvv2vh0',
    description: 'Уникальный идентификатор аренды',
  })
  declare rentalId: string;
}
