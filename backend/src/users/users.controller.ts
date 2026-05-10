import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/decorators/check-admin.decorator';
import {
  CurrentUser,
  type JwtUser,
} from 'src/auth/decorators/current-user.decorator';
import type { UpdateMeDTO, UpdateUserDTO } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAll() {
    return await this.userService.getAll();
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@CurrentUser() user: JwtUser) {
    return await this.userService.getById(user.userId, true);
  }

  @Get('/admin/stats')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAdminStats() {
    return await this.userService.getAdminStats();
  }

  @Get('/admin/search')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getSearched(@Query('q') query: string) {
    return await this.userService.searchUsers(query);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getUser(@Param('id') id: string) {
    return await this.userService.getById(id, true);
  }

  @Patch('/me')
  @UseGuards(AuthGuard('jwt'))
  async updateMe(@CurrentUser() user: JwtUser, @Body() data: UpdateMeDTO) {
    return this.userService.updateUser(user.userId, data);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    return await this.userService.updateUser(id, data);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
