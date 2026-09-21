import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { BicyclesService } from './bicycles.service';
import { CreateBicycleDto } from './dto/create-bicycle.dto';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { BicyclesQueryDto } from './dto/bicycles-query.dto';

@Roles(Role.Admin, Role.User)
@Controller('bicycles')
export class BicyclesController {
  constructor(private readonly bicyclesService: BicyclesService) {}

  @Get()
  findAll(@Query() query: BicyclesQueryDto, @CurrentUser('role') role: Role) {
    return this.bicyclesService.findBicycles(query, role);
  }

  @Get(':id')
  findById(@Param('id') id: string, @CurrentUser('role') role: Role) {
    return this.bicyclesService.findBicycleById(id, role);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() dto: CreateBicycleDto) {
    return this.bicyclesService.createBicycle(dto);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBicycleDto) {
    return this.bicyclesService.updateBicycle(id, dto);
  }

  @Roles(Role.Admin)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bicyclesService.removeBicycle(id);
  }
}
