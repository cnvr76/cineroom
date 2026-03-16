import {
  Controller,
  Get,
  NotImplementedException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/decorators/check-admin.decorator';
import {
  CurrentUser,
  type JwtUser,
} from 'src/auth/decorators/current-user.decorator';

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
    // TODO
    throw new NotImplementedException();
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getUser(@Param('id') id: string) {
    return await this.userService.getById(id);
  }
}
