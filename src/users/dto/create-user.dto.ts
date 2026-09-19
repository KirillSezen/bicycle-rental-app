import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsStrongPassword,
  Length,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'mike Vazovski', description: 'Имя пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @Length(4, 20, { message: 'Не меньше 4 и не больше 20' })
  declare username: string;

  @ApiProperty({ example: 'mike2@example.com', description: 'Email пользователя' })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  declare email: string;

  @ApiProperty({ example: 'Randompass23##2', description: 'Пароль пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minSymbols: 1 },
    { message: 'Пароль слишком слабый' },
  )
  declare password: string;

  @ApiProperty({
    enum: Role,
    example: Role.User,
    description: 'Роль пользователя',
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Некорректное значение role' })
  role?: Role;
}
