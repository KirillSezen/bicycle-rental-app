import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import type { AuthUser, RefreshToken } from './types/auth.types';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/response-user.dto';
import { TokenResponseDto } from './dto/tokens-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @Public()
  @Post('registration')
  registration(@Body() dto: RegisterDto) {
    return this.authService.registration(dto);
  }

  @ApiOperation({ summary: 'Логин пользователя' })
  @ApiResponse({ status: 200, type: TokenResponseDto })
  @ApiBody({ type: LoginDto })
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  login(@CurrentUser() user: AuthUser) {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiResponse({ status: 204 })
  @ApiBody({ type: RefreshTokenDto })
  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(204)
  @Post('logout')
  logout(@CurrentUser() user: RefreshToken) {
    return this.authService.logout(user);
  }

  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse({ status: 200, type: TokenResponseDto })
  @ApiBody({ type: RefreshTokenDto })
  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @Post('refresh')
  refresh(@CurrentUser() user: RefreshToken) {
    return this.authService.refresh(user);
  }
}
