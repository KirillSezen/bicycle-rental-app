import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BicyclesRepository } from './bicycles.repository';
import { CreateBicycleDto } from './dto/create-bicycle.dto';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';
import { BicyclesQueryDto } from './dto/bicycles-query.dto';
import { BicycleStatus, Role } from 'src/generated/prisma/enums';

@Injectable()
export class BicyclesService {
  constructor(private bicycleRepo: BicyclesRepository) {}

  async findBicycles(query: BicyclesQueryDto, role: Role) {
    return this.bicycleRepo.findMany(query, role);
  }

  async findBicycleById(id: string, role: Role) {
    const bicycle = await this.bicycleRepo.findByIdForUser(id, role);
    if (!bicycle) throw new NotFoundException('Велосипеда с таким id не существует');

    return bicycle;
  }

  async createBicycle(dto: CreateBicycleDto) {
    return this.bicycleRepo.create(dto);
  }

  async updateBicycle(id: string, dto: UpdateBicycleDto) {
    const bicycle = await this.bicycleRepo.findByIdForAdmin(id);
    if (!bicycle) {
      throw new NotFoundException('Велосипеда с таким id не существует');
    }

    return this.bicycleRepo.update(id, dto);
  }

  async removeBicycle(id: string) {
    const bicycle = await this.bicycleRepo.findByIdForAdmin(id);
    if (!bicycle) {
      throw new NotFoundException('Велосипеда с таким id не существует');
    }

    return this.bicycleRepo.remove(id);
  }

  async archiveBicycle(id: string) {
    const bicycle = await this.bicycleRepo.findByIdForAdmin(id);
    if (!bicycle) {
      throw new NotFoundException('Велосипеда с таким id не существует');
    }

    if (bicycle.status !== BicycleStatus.Available) {
      const message =
        bicycle.status === BicycleStatus.Archive
          ? 'Данный велосипед уже в архиве'
          : 'Данный велосипед уже арендован';
      throw new ConflictException(message);
    }

    return this.bicycleRepo.archive(id);
  }
}
