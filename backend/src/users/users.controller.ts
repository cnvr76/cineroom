import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDTO } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getById(id);
  }
}
