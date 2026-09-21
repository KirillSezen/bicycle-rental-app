import { Module } from '@nestjs/common';
import { BicyclesController } from './bicycles.controller';
import { BicyclesService } from './bicycles.service';

@Module({
  controllers: [BicyclesController],
  providers: [BicyclesService],
})
export class BicyclesModule {}
