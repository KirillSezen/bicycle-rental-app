import { IsNotEmpty, IsInt, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  declare rentalId: string;

  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsInt({ message: 'Должно быть числом' })
  @Min(1, { message: 'Минимум 1' })
  @Max(5, { message: 'Максимум 5' })
  declare rating: number;

  @IsString({ message: 'Должно быть строкой' })
  @MaxLength(350, { message: 'Максимальная длина сообщения 350 символов' })
  declare comment: string;
}
