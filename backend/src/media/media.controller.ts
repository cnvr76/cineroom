import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Param,
  UseGuards,
  Post,
  NotImplementedException,
  Patch,
  Body,
  DefaultValuePipe,
} from '@nestjs/common';
import { MediaService } from './media.service';
import type { MediaType } from './media.types';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type JwtUser,
} from 'src/auth/decorators/current-user.decorator';
import type { UpdateMediaDTO } from './dto/media.dto';
import { AdminGuard } from 'src/auth/decorators/check-admin.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly moviesService: MediaService) {}

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('type') mediaType: MediaType | 'all' = 'all',
  ) {
    return await this.moviesService.getPaginated(mediaType, page);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async updateMedia(
    @Param('id') id: string,
    @Body() body: Partial<UpdateMediaDTO>,
  ) {
    return await this.moviesService.updateMedia(id, body);
  }

  @Get('/me/favorites')
  @UseGuards(AuthGuard('jwt'))
  async getPaginatedFavorites(
    @CurrentUser() user: JwtUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('type') mediaType: MediaType | 'all' = 'all',
  ) {
    // TODO
    throw new NotImplementedException();
  }

  @Post('/:id/save')
  @UseGuards(AuthGuard('jwt'))
  async markAsFavorite(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    // TODO
    throw new NotImplementedException();
  }

  @Get('/search/:title')
  async getSearched(@Param('title') title: string) {
    // TODO
    throw new NotImplementedException();
  }

  @Get('/:type/:id')
  async getSpecific(
    @Param('type') mediaType: MediaType,
    @Param('id') id: string,
  ) {
    return await this.moviesService.getDetails(id, mediaType);
  }
}
