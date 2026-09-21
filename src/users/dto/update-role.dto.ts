import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/generated/prisma/enums';

export class UpdateRoleDto {
  @ApiProperty({
    enum: Role,
    example: Role.User,
    description: 'Роль пользователя',
  })
  @IsEnum(Role, { message: 'Некорректное значение role' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  declare role: Role;
}
