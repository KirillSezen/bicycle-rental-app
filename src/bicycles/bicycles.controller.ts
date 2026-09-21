import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { BicyclesService } from './bicycles.service';
import { CreateBicycleDto } from './dto/create-bicycle.dto';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { BicyclesQueryDto } from './dto/bicycles-query.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BicycleResponseDto } from './dto/response-bicycle.dto';

@Roles(Role.Admin, Role.User)
@Controller('bicycles')
export class BicyclesController {
  constructor(private readonly bicyclesService: BicyclesService) {}

  @ApiOperation({ summary: 'Получение всех велосипедов' })
  @ApiResponse({ status: 200, type: [BicycleResponseDto] })
  @Get()
  findAll(@Query() query: BicyclesQueryDto, @CurrentUser('role') role: Role) {
    return this.bicyclesService.findBicycles(query, role);
  }

  @ApiOperation({ summary: 'Получение велосипеда по id' })
  @ApiResponse({ status: 200, type: BicycleResponseDto })
  @Get(':id')
  findById(@Param('id') id: string, @CurrentUser('role') role: Role) {
    return this.bicyclesService.findBicycleById(id, role);
  }

  @ApiOperation({ summary: 'Создание велосипеда' })
  @ApiResponse({ status: 201, type: BicycleResponseDto })
  @Roles(Role.Admin)
  @Post()
  create(@Body() dto: CreateBicycleDto) {
    return this.bicyclesService.createBicycle(dto);
  }

  @ApiOperation({ summary: 'Изменение велосипеда' })
  @ApiResponse({ status: 200, type: BicycleResponseDto })
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBicycleDto) {
    return this.bicyclesService.updateBicycle(id, dto);
  }

  @ApiOperation({ summary: 'Удаление велосипеда' })
  @ApiResponse({ status: 204, type: BicycleResponseDto })
  @Roles(Role.Admin)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bicyclesService.removeBicycle(id);
  }

  @ApiOperation({ summary: 'Перевод велосипеда в статус архивного' })
  @ApiResponse({ status: 200, type: BicycleResponseDto })
  @Roles(Role.Admin)
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.bicyclesService.archiveBicycle(id);
  }
}
