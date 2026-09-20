import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import type { AuthUser, RefreshToken } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('registration')
  registration(@Body() dto: RegisterDto) {
    return this.authService.registration(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  login(@CurrentUser() user: AuthUser) {
    return this.authService.login(user);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(204)
  @Post('logout')
  logout(@CurrentUser() user: RefreshToken) {
    return this.authService.logout(user);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @Post('refresh')
  refresh(@CurrentUser() user: RefreshToken) {
    return this.authService.refresh(user);
  }
}
