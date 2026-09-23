import { Module } from '@nestjs/common';
import { BicyclesController } from './bicycles.controller';
import { BicyclesService } from './bicycles.service';
import { BicyclesRepository } from './bicycles.repository';

@Module({
  controllers: [BicyclesController],
  providers: [BicyclesService, BicyclesRepository],
  exports: [BicyclesService],
})
export class BicyclesModule {}
