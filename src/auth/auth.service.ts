import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registration.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async registration(dto: RegisterDto) {
    return this.usersService.createUser(dto);
  }
}
