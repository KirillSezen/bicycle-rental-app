import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { RentalStatus, Role } from 'src/generated/prisma/enums';
import { ReviewsQueryDto } from './dto/review-query.dto';
import { BicyclesService } from 'src/bicycles/bicycles.service';

const REVIEWABLE_STATUSES: RentalStatus[] = ['Completed', 'Close'];

@Injectable()
export class ReviewsService {
  constructor(
    private reviewsRepository: ReviewsRepository,
    private bicycleService: BicyclesService,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const rental = await this.reviewsRepository.findRentalById(dto.rentalId);

    if (!rental) throw new NotFoundException('Аренды с таким id не существует');
    if (rental.userId !== userId) throw new ForbiddenException('Это не ваша аренда');
    if (!REVIEWABLE_STATUSES.includes(rental.status)) {
      throw new BadRequestException('Отзыв можно оставить только по завершённой аренде');
    }

    return this.reviewsRepository.create(rental.id, dto.rating, dto.comment);
  }

  async findByBicycle(bicycleId: string, query: ReviewsQueryDto, role: Role) {
    await this.bicycleService.findBicycleById(bicycleId, role);

    return this.reviewsRepository.findMany(bicycleId, query);
  }
}
