import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalsRepository } from './rentals.repository';
import { RentalsQueryDto } from './dto/rentals-query.dto';
import { BicyclesService } from 'src/bicycles/bicycles.service';
import { Role } from 'src/generated/prisma/enums';

const START_TOLERANCE_MS = 60_000;

@Injectable()
export class RentalsService {
  constructor(
    private rentalsRepo: RentalsRepository,
    private bicyclesService: BicyclesService,
  ) {}

  async create(userId: string, role: Role, dto: CreateRentalDto) {
    const { bicycleId, startTime, endTime } = dto;

    await this.bicyclesService.findBicycleById(bicycleId, role);

    if (endTime <= startTime) {
      throw new BadRequestException('endTime должен быть позже startTime');
    }
    if (startTime.getTime() < Date.now() - START_TOLERANCE_MS) {
      throw new BadRequestException('startTime не может быть в прошлом');
    }

    return this.rentalsRepo.create(bicycleId, userId, startTime, endTime);
  }

  async findAllOwn(userId: string, query: RentalsQueryDto) {
    if (query.dateFrom && query.dateTo && query.dateFrom > query.dateTo) {
      throw new BadRequestException('dateFrom не может быть позже dateTo');
    }

    return this.rentalsRepo.findMany(query, userId);
  }

  findOneOwn(userId: string, id: string) {
    return this.getOwn(userId, id);
  }

  async finish(userId: string, id: string) {
    const rental = await this.getOwn(userId, id);

    const now = new Date();
    if (now <= rental.startTime) {
      throw new ConflictException('Аренда ещё не началась');
    }

    const { count } = await this.rentalsRepo.finish(id, now);
    if (count === 0) throw new ConflictException('Аренда уже завершена');

    return this.getOwn(userId, id);
  }

  async close(userId: string, id: string) {
    await this.getOwn(userId, id);

    const { count } = await this.rentalsRepo.close(id);
    if (count === 0) {
      throw new ConflictException('Закрыть можно только завершённую аренду');
    }

    return this.getOwn(userId, id);
  }

  private async getOwn(userId: string, id: string) {
    const rental = await this.rentalsRepo.findById(id);
    if (!rental) throw new NotFoundException('Аренды с таким id не существует');
    if (rental.userId !== userId) throw new ForbiddenException('Это не ваша аренда');

    return rental;
  }
}
