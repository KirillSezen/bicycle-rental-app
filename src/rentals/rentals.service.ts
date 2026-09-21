import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalsRepository } from './rentals.repository';

const START_TOLERANCE_MS = 60_000;

@Injectable()
export class RentalsService {
  constructor(private rentalsRepo: RentalsRepository) {}

  async create(userId: string, dto: CreateRentalDto) {
    const { bicycleId, startTime, endTime } = dto;

    if (endTime <= startTime) {
      throw new BadRequestException('endTime должен быть позже startTime');
    }
    if (startTime.getTime() < Date.now() - START_TOLERANCE_MS) {
      throw new BadRequestException('startTime не может быть в прошлом');
    }

    return this.rentalsRepo.create(bicycleId, userId, startTime, endTime);
  }
}
