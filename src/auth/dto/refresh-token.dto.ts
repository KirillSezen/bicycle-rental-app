import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwM2ExNWNjZC0xNTcyLTQ3MDAtYTQ0My02YjVhZWQ5ZmVjZWMiLCJqdGkiOiJmZWUxODNiYS03YTNiCV32M2ItYmI0ZC1jZjI3Mzc5MTVkMGQiLCJpYXQiOjE3ODk5MzYyNzYsImV4cCI6MTc5MDU0MTA3Nn0.rTtljx9UqnoNo_8oOelfH5_PTU9XCuK_8dotri6WITI',
    description: 'Refresh токен пользователя',
  })
  declare refreshToken: string;
}
