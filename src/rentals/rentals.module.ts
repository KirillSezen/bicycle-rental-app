import { Module } from '@nestjs/common';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { RentalsRepository } from './rentals.repository';
import { BicyclesModule } from 'src/bicycles/bicycles.module';

@Module({
  imports: [BicyclesModule],
  controllers: [RentalsController],
  providers: [RentalsService, RentalsRepository],
})
export class RentalsModule {}
