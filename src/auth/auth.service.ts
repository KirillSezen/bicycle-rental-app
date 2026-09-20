import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registration.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async registration(dto: RegisterDto) {
    return this.usersService.createUser(dto);
  }

  async login(user: { email: string }) {
    return this.usersService.getUserByEmail(user.email);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) return null;

    const compareResult = await bcrypt.compare(password, user.passwordHash);
    return compareResult
      ? { id: user.id, email: user.email, username: user.username, role: user.role }
      : null;
  }
}
