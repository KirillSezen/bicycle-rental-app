import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registration.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import type { AuthUser, RefreshToken } from './types/auth.types';
import { Role } from 'src/generated/prisma/enums';

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
    return this.generateTokens(user.id, user.email, user.username, user.role);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) return null;

    const compareResult = await bcrypt.compare(password, user.passwordHash);
    return compareResult
      ? { id: user.id, email: user.email, username: user.username, role: user.role }
      : null;
  }

  async logout(user: RefreshToken) {
    await this.assertActiveRefreshToken(user.jti, user.refreshToken);
    await this.authRepository.revokeRefreshTokens(user.jti);

    return { message: 'successful logged out' };
  }

  async refresh(user: RefreshToken) {
    await this.assertActiveRefreshToken(user.jti, user.refreshToken);

    const { count } = await this.authRepository.revokeRefreshTokens(user.jti);
    if (count === 0) throw new UnauthorizedException('Refresh-токен отозван');

    const candidate = await this.usersService.getUserById(user.userId);
    if (!candidate) throw new UnauthorizedException('Вы не авторизованны');

    return this.generateTokens(candidate.id, candidate.email, candidate.username, candidate.role);
  }

  private async generateTokens(userId: string, email: string, username: string, role: Role) {
    const accessTtl = Number(this.configService.getOrThrow<number>('JWT_ACCESS_TTL'));
    const refreshTtl = Number(this.configService.getOrThrow<number>('JWT_REFRESH_TTL'));
    const jti = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, username, role },
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

  private async assertActiveRefreshToken(jti: string, rawToken: string) {
    const stored = await this.authRepository.findRefreshTokenByJti(jti);

    if (
      !stored ||
      stored.revokedAt !== null ||
      stored.expiresAt < new Date() ||
      stored.tokenHash !== createHash('sha256').update(rawToken).digest('hex')
    ) {
      throw new UnauthorizedException('Недействительный refresh-токен');
    }
  }
}
