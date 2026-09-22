import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { RentalStatus } from 'src/generated/prisma/enums';

const REVIEWABLE_STATUSES: RentalStatus[] = ['Completed', 'Close'];

@Injectable()
export class ReviewsService {
  constructor(private reviewsRepository: ReviewsRepository) {}

  async create(userId: string, dto: CreateReviewDto) {
    const rental = await this.reviewsRepository.findRentalById(dto.rentalId);

    if (!rental) throw new NotFoundException('Аренды с таким id не существует');
    if (rental.userId !== userId) throw new ForbiddenException('Это не ваша аренда');
    if (!REVIEWABLE_STATUSES.includes(rental.status)) {
      throw new BadRequestException('Отзыв можно оставить только по завершённой аренде');
    }

    return this.reviewsRepository.create(rental.id, dto.rating, dto.comment);
  }
}
