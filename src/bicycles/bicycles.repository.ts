import { Injectable } from '@nestjs/common';
import { Bicycle, BicycleStatus, Prisma, Role } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BicyclesQueryDto } from './dto/bicycles-query.dto';

export interface SortedBicycles {
  data: Bicycle[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class BicyclesRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(query: BicyclesQueryDto, role: Role): Promise<SortedBicycles> {
    const { where, orderBy } = this.setupWhereAndOrderBy(query, role);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.bicycle.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.bicycle.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  findByIdForUser(id: string, role: Role): Promise<Bicycle | null> {
    return this.prisma.bicycle.findUnique({
      where: {
        id,
        AND: role === Role.Admin ? undefined : { status: { not: BicycleStatus.Archive } },
      },
    });
  }

  findByIdForAdmin(id: string): Promise<Bicycle | null> {
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

  setupWhereAndOrderBy(query: BicyclesQueryDto, role: Role) {
    const where: Prisma.BicycleWhereInput = {
      model: query.model ? { contains: query.model, mode: 'insensitive' } : undefined,

      location: query.location ? { contains: query.location, mode: 'insensitive' } : undefined,
      status: query.status,

      AND: role === Role.Admin ? undefined : { status: { not: BicycleStatus.Archive } },
    };

    const orderBy = [
      { [query.sortBy ?? 'id']: query.order },
      { id: 'asc' },
    ] as Prisma.BicycleOrderByWithRelationInput[];

    return { where, orderBy };
  }
}
