import { Injectable, NotFoundException } from '@nestjs/common';
import { BicyclesRepository } from './bicycles.repository';
import { CreateBicycleDto } from './dto/create-bicycle.dto';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';

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

  async createBicycle(dto: CreateBicycleDto) {
    return this.bicycleRepo.create(dto);
  }

  async updateBicycle(id: string, dto: UpdateBicycleDto) {
    const bicycle = await this.bicycleRepo.findById(id);
    if (!bicycle) {
      throw new NotFoundException('Велосипеда с таким id не существует');
    }

    return this.bicycleRepo.update(id, dto);
  }

  async removeBicycle(id: string) {
    const bicycle = await this.bicycleRepo.findById(id);
    if (!bicycle) {
      throw new NotFoundException('Велосипеда с таким id не существует');
    }

    return this.bicycleRepo.remove(id);
  }
}
