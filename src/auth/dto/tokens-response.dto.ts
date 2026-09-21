import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwM2ExNWNjZC0xNTcyLTQ3MDAtYTQ0My02YjVhZWQ5ZmVjZWMiLCJqdGkiOiJmZWUxODNiYS03YTNiLTQ5M2ItYmI0ZC1jZjI3Mzc5MTVkMGQiLCJpYXQiOjE3ODk5MzYyNzYsImV4cCI6MTc5MDU0MTA3Nn0.rTtljx9UqnoNo_8oOelfH5_PTU9XCuK_8dotri6WITI',
    description: 'Access токен пользователя',
  })
  declare accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwM2ExNWNjZC0xNTcyLTQ3MDAtYTQ0My02YjVhZWQ5ZmVjZWMiLCJqdGkiOiJmZWUxODNiYS03YTNiCV32M2ItYmI0ZC1jZjI3Mzc5MTVkMGQiLCJpYXQiOjE3ODk5MzYyNzYsImV4cCI6MTc5MDU0MTA3Nn0.rTtljx9UqnoNo_8oOelfH5_PTU9XCuK_8dotri6WITI',
    description: 'Refresh токен пользователя',
  })
  declare refreshToken: string;
}
