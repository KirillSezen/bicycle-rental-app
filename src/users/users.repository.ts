import { Injectable } from '@nestjs/common';
import { Prisma, Role, User } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

type UserWithoutPassword = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersRepository {
  private readonly select = {
    id: true,
    username: true,
    email: true,
    role: true,
  };

  constructor(private prisma: PrismaService) {}

  findMany(): Promise<UserWithoutPassword[]> {
    return this.prisma.user.findMany({ select: this.select });
  }

  findById(id: string): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findUnique({ where: { id }, select: this.select });
  }

  findByEmailOrUsername(email: string, username: string): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: this.select,
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: Prisma.UserCreateInput): Promise<UserWithoutPassword> {
    return this.prisma.user.create({ data, select: this.select });
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<UserWithoutPassword> {
    return this.prisma.user.update({ where: { id }, data, select: this.select });
  }

  remove(id: string): Promise<UserWithoutPassword> {
    return this.prisma.user.delete({ where: { id }, select: this.select });
  }

  setupRole(id: string, role: Role): Promise<[UserWithoutPassword, BatchPayload]> {
    return this.prisma.$transaction([
      this.prisma.user.update({ where: { id }, data: { role }, select: this.select }),
      this.revokeRefreshTokens(id),
    ]);
  }

  revokeRefreshTokens(id: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
