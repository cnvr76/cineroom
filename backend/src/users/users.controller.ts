import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getById(id);
  }
}
