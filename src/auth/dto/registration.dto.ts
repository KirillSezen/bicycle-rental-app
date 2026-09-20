import { IsEmail, IsString, IsStrongPassword, IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @Length(4, 20, { message: 'Не меньше 4 и не больше 20' })
  declare username: string;

  @IsEmail({}, { message: 'Некорректный email' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  declare email: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minSymbols: 1 },
    { message: 'Пароль слишком слабый' },
  )
  declare password: string;
}
