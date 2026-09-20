import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registration.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { type AuthUser } from './decorators/current-user.decorator';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async registration(dto: RegisterDto) {
    return this.usersService.createUser(dto);
  }

  async login(user: AuthUser) {
    return this.generateTokens(user.id, user.email);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) return null;

    const compareResult = await bcrypt.compare(password, user.passwordHash);
    return compareResult
      ? { id: user.id, email: user.email, username: user.username, role: user.role }
      : null;
  }

  private async generateTokens(userId: string, email: string) {
    const accessTtl = Number(this.configService.getOrThrow<number>('JWT_ACCESS_TTL'));
    const refreshTtl = Number(this.configService.getOrThrow<number>('JWT_REFRESH_TTL'));
    const jti = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: accessTtl,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, jti },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: refreshTtl,
        },
      ),
    ]);

    await this.authRepository.createRefreshToken(jti, userId, refreshToken, refreshTtl);

    return { accessToken, refreshToken };
  }
}
