import { Injectable } from '@nestjs/common';
import { Bicycle, Prisma } from 'src/generated/prisma/client';
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

  create(data: Prisma.BicycleCreateInput): Promise<Bicycle> {
    return this.prisma.bicycle.create({ data });
  }

  update(id: string, data: Prisma.BicycleUpdateInput): Promise<Bicycle> {
    return this.prisma.bicycle.update({ where: { id }, data });
  }

  remove(id: string): Promise<Bicycle> {
    return this.prisma.bicycle.delete({ where: { id } });
  }
}
