import { Injectable } from '@nestjs/common';
import { Rental, Review } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
  constructor(private prismaService: PrismaService) {}

  findRentalById(rentalId: string): Promise<Rental | null> {
    return this.prismaService.rental.findUnique({ where: { id: rentalId } });
  }

  create(rentalId: string, rating: number, comment: string): Promise<Review> {
    return this.prismaService.review.create({
      data: {
        rentalId,
        rating,
        comment,
      },
    });
  }
}
