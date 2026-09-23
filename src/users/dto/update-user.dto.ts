import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsStrongPassword, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'mike Vazovski', description: 'Имя пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 20, { message: 'Не меньше 4 и не больше 20' })
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'mike2@example.com', description: 'Email пользователя' })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsString({ message: 'Должно быть строкой' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Randompass23##2', description: 'Пароль пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minSymbols: 1 },
    { message: 'Пароль слишком слабый' },
  )
  @IsOptional()
  password?: string;
}
