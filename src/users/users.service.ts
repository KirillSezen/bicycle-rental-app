import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepository) {}

  async getUsers() {
    return this.userRepo.findMany();
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Пользователя с таким id не существует');

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      return;
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const candidate = await this.userRepo.findByEmailOrUsername(dto.email, dto.username);
    if (candidate) {
      if (candidate.email === dto.email) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
      throw new ConflictException('Пользователь с таким username уже существует');
    }

    const { password, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, 10);

    return this.userRepo.create({ ...rest, passwordHash });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('Пользователя с таким id не существует');
    }

    if (dto.password) {
      const { password, ...rest } = dto;
      const passwordHash = await bcrypt.hash(password, 10);
      return this.userRepo.update(id, { ...rest, passwordHash });
    }

    return this.userRepo.update(id, dto);
  }

  async removeUser(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('Пользователя с таким id не существует');
    }

    return this.userRepo.remove(id);
  }

  async setRole(userid: string, id: string, role: Role) {
    const candidate = await this.userRepo.findById(id);
    if (!candidate) {
      throw new NotFoundException('Пользователя с таким id не существует');
    }

    if (id === userid) throw new ForbiddenException('Нельзя изменить собственную роль');
    const [user] = await this.userRepo.setupRole(id, role);
    return user;
  }
}
