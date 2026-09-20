import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  registration(@Body() dto: RegisterDto) {
    return this.authService.registration(dto);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('/login')
  login(@Body() user: { id: string; email: string }) {
    return this.authService.login(user);
  }
}
