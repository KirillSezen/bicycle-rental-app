import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsQueryDto } from './dto/review-query.dto';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.User)
  @Post('review')
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto);
  }

  @Roles(Role.User, Role.Admin)
  @Get('bicycles/:bicycleId/reviews')
  findByBicycle(
    @Param('bicycleId') bicycleId: string,
    @Query() query: ReviewsQueryDto,
    @CurrentUser('role') role: Role,
  ) {
    return this.reviewsService.findByBicycle(bicycleId, query, role);
  }
}
