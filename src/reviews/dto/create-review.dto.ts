import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 'a02eze01-d723-1l8h-u3u5-026nj272az66',
    description: 'Уникальный идентификатор отзыва',
  })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  declare rentalId: string;

  @ApiProperty({
    example: 4,
    description: 'Рейтинг отзыва',
  })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsInt({ message: 'Должно быть числом' })
  @Min(1, { message: 'Минимум 1' })
  @Max(5, { message: 'Максимум 5' })
  declare rating: number;

  @ApiProperty({
    example: 'Nice one !',
    description: 'Комментарий отзыва',
  })
  @IsString({ message: 'Должно быть строкой' })
  @MaxLength(350, { message: 'Максимальная длина сообщения 350 символов' })
  @MinLength(5, { message: 'Минимальная длина сообщения 5 символов' })
  declare comment: string;
}
