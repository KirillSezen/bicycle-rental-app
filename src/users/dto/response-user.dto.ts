import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/enums';

export class UserResponseDto {
  @ApiProperty({
    example: '670e6722-h19b-41d4-a7f6-446643440000',
    description: 'Уникальный идентификатор',
  })
  declare id: string;

  @ApiProperty({ example: 'mike Vazovski', description: 'Имя пользователя' })
  declare username: string;

  @ApiProperty({ example: 'mike2@example.com', description: 'Email пользователя' })
  declare email: string;

  @ApiProperty({ enum: Role, example: Role.User, description: 'Роль пользователя' })
  declare role: Role;
}
