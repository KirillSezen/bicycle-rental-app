import { Controller, Get, Param } from '@nestjs/common';
import { BicyclesService } from './bicycles.service';

@Controller('bicycles')
export class BicyclesController {
  constructor(private readonly bicyclesService: BicyclesService) {}

  @Get()
  findAll() {
    return this.bicyclesService.findBicycles();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.bicyclesService.findBicycleById(id);
  }
}
