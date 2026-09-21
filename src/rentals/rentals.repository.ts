import { ConflictException, Injectable } from '@nestjs/common';
import { BicycleStatus, Prisma, Rental, RentalStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RentalsQueryDto } from './dto/rentals-query.dto';

export interface RentalWithBicycle extends Rental {
  bicycle: {
    id: string;
    model: string;
    location: string;
    pricePerHour: number;
  };
}

export interface SortedRentals {
  data: RentalWithBicycle[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class RentalsRepository {
  constructor(private prisma: PrismaService) {}

  create(bicycleId: string, userId: string, startTime: Date, endTime: Date): Promise<Rental> {
    return this.prisma.$transaction(async (tx) => {
      const bicycle = await this.lockBike(tx, bicycleId);
      if (bicycle.status !== BicycleStatus.Available) {
        throw new ConflictException('Велосипед в архиве и недоступен для аренды');
      }

      await this.checkOverlap(tx, bicycleId, startTime, endTime);

      return tx.rental.create({
        data: { userId, bicycleId, startTime, endTime },
      });
    });
  }

  findById(id: string) {
    return this.prisma.rental.findUnique({ where: { id } });
  }

  async findMany(query: RentalsQueryDto, userId: string): Promise<SortedRentals> {
    const { where, orderBy } = this.setupWhereAndOrderBy(userId, query);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.rental.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        include: {
          bicycle: { select: { id: true, model: true, location: true, pricePerHour: true } },
        },
      }),
      this.prisma.rental.count({ where }),
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

  private setupWhereAndOrderBy(userId: string, query: RentalsQueryDto) {
    const where: Prisma.RentalWhereInput = {
      userId,
      status: query.status,
      startTime:
        query.dateFrom || query.dateTo ? { gte: query.dateFrom, lte: query.dateTo } : undefined,
    };

    const orderBy = [
      { [query.sortBy]: query.order } as Prisma.RentalOrderByWithRelationInput,
      { id: query.order },
    ];

    return { where, orderBy };
  }

  private async lockBike(tx: Prisma.TransactionClient, id: string) {
    return await tx.bicycle.update({ where: { id }, data: { rentalsCount: { increment: 1 } } });
  }

  private async checkOverlap(
    tx: Prisma.TransactionClient,
    bicycleId: string,
    start: Date,
    end: Date,
  ) {
    const overlap = await tx.rental.findFirst({
      where: {
        bicycleId,
        status: RentalStatus.Active,
        startTime: { lt: end },
        endTime: { gt: start },
      },
      select: { id: true },
    });
    if (overlap) {
      throw new ConflictException('Велосипед уже забронирован на пересекающийся период');
    }
  }
}
