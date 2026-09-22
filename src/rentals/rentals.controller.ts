import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalsService } from './rentals.service';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RentalsQueryDto } from './dto/rentals-query.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RentalResponseDto } from './dto/response-rentals.dto';

@Roles(Role.User)
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @ApiOperation({ summary: 'Создание аренды' })
  @ApiResponse({ status: 201, type: RentalResponseDto })
  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateRentalDto) {
    return this.rentalsService.create(userId, dto);
  }

  @ApiOperation({ summary: 'Получение всех аренд пользователя' })
  @ApiResponse({ status: 200, type: [RentalResponseDto] })
  @Get()
  findAll(@CurrentUser('userId') userId: string, @Query() query: RentalsQueryDto) {
    return this.rentalsService.findAllOwn(userId, query);
  }

  @ApiOperation({ summary: 'Получение одной аренды пользователя' })
  @ApiResponse({ status: 200, type: RentalResponseDto })
  @Get(':id')
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.rentalsService.findOneOwn(userId, id);
  }

  @ApiOperation({ summary: 'Завершение аренды пользователя' })
  @ApiResponse({ status: 200, type: RentalResponseDto })
  @Post(':id/finish')
  @HttpCode(200)
  finish(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.rentalsService.finish(userId, id);
  }

  @ApiOperation({ summary: 'Закрытие аренды пользователя' })
  @ApiResponse({ status: 200, type: RentalResponseDto })
  @Post(':id/close')
  @HttpCode(200)
  close(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.rentalsService.close(userId, id);
  }
}
