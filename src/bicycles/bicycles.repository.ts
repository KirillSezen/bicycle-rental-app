import { Injectable } from '@nestjs/common';
import { Bicycle } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BicyclesRepository {
  constructor(private prisma: PrismaService) {}

  findMany(): Promise<Bicycle[]> {
    return this.prisma.bicycle.findMany();
  }

  findById(id: string): Promise<Bicycle | null> {
    return this.prisma.bicycle.findUnique({ where: { id } });
  }
}
