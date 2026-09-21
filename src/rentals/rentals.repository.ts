import { ConflictException, Injectable } from '@nestjs/common';
import { BicycleStatus, Prisma, Rental, RentalStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
