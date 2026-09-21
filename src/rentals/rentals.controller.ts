import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalsService } from './rentals.service';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Roles(Role.User)
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateRentalDto) {
    return this.rentalsService.create(userId, dto);
  }
}
