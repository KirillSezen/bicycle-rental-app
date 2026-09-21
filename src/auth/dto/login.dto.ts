import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'mike2@example.com', description: 'Email пользователя' })
  declare email: string;

  @ApiProperty({ example: 'Randompass23##2', description: 'Пароль пользователя' })
  declare password: string;
}
