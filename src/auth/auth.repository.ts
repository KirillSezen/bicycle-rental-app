import { Injectable } from '@nestjs/common';
import { UUID, createHash } from 'node:crypto';
import { RefreshToken } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  createRefreshToken(
    jti: UUID,
    userId: string,
    refreshToken: string,
    refreshTtl: number,
  ): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: {
        id: jti,
        userId,
        tokenHash: createHash('sha256').update(refreshToken).digest('hex'),
        expiresAt: new Date(Date.now() + refreshTtl * 1000),
      },
    });
  }
}
