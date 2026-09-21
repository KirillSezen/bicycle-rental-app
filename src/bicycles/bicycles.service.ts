import { Injectable, NotFoundException } from '@nestjs/common';
import { BicyclesRepository } from './bicycles.repository';

@Injectable()
export class BicyclesService {
  constructor(private bicycleRepo: BicyclesRepository) {}

  async findBicycles() {
    return this.bicycleRepo.findMany();
  }

  async findBicycleById(id: string) {
    const bicycle = await this.bicycleRepo.findById(id);
    if (!bicycle) throw new NotFoundException('Велосипеда с таким id не существует');

    return bicycle;
  }
}
