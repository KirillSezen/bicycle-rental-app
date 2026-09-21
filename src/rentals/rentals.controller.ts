import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalsService } from './rentals.service';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RentalsQueryDto } from './dto/rentals-query.dto';

@Roles(Role.User)
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateRentalDto) {
    return this.rentalsService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: string, @Query() query: RentalsQueryDto) {
    return this.rentalsService.findAllOwn(userId, query);
  }

  @Get(':id')
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.rentalsService.findOneOwn(userId, id);
  }

  @Post(':id/finish')
  @HttpCode(200)
  finish(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.rentalsService.finish(userId, id);
  }

  @Post(':id/close')
  @HttpCode(200)
  close(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.rentalsService.close(userId, id);
  }
}
