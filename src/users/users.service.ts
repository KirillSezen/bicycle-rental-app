import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepository) {}

  async getUsers() {
    return this.userRepo.findMany();
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }
}
