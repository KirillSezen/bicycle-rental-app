import { Injectable } from '@nestjs/common';
import { Rental, Review } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewsQueryDto } from './dto/review-query.dto';

export interface SortedReviews {
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ReviewsRepository {
  constructor(private prismaService: PrismaService) {}

  private readonly select = {
    id: true,
    rating: true,
    comment: true,
    createdAt: true,
    updatedAt: true,
    rentalId: true,
    rental: {
      select: {
        user: { select: { id: true, username: true } },
      },
    },
  };

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

  async findMany(bicycleId: string, query: ReviewsQueryDto): Promise<SortedReviews> {
    const where = { rental: { bicycleId } };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.review.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        select: this.select,
      }),
      this.prismaService.review.count({ where }),
    ]);

    return {
      data: data.map(({ rental, ...rest }) => ({ ...rest, author: rental.user })),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }
}
