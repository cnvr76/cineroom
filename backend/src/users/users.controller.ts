import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/decorators/check-admin.decorator';
import {
  CurrentUser,
  type JwtUser,
} from 'src/auth/decorators/current-user.decorator';
import type { UpdateMeDTO, UpdateUserDTO } from './dto/users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Post('/me/avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only images allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @CurrentUser() user: JwtUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.setAvatar(
      user.userId,
      `/static/${file.filename}`,
    );
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
