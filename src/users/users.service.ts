import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

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

  async createUser(dto: CreateUserDto) {
    const candidate = await this.userRepo.findByEmailOrUsername(dto.email, dto.username);
    if (candidate) {
      if (candidate.email === dto.email) {
        throw new BadRequestException('Пользователь с таким email уже существует');
      }
      throw new BadRequestException('Пользователь с таким username уже существует');
    }

    const { password, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, 10);

    return this.userRepo.create({ ...rest, passwordHash });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new BadRequestException('Пользователя с таким id не существует');
    }

    return this.userRepo.update(id, dto);
  }

  async removeUser(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new BadRequestException('Пользователя с таким id не существует');
    }

    return this.userRepo.remove(id);
  }
}
