import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Param,
  UseGuards,
  Post,
  Patch,
  Body,
  DefaultValuePipe,
  Delete,
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
import { OptionalAuthGuard } from 'src/auth/decorators/optional-user.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly moviesService: MediaService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async getAll(
    @CurrentUser() user: JwtUser | null,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('type') mediaType: MediaType | 'all' = 'all',
  ) {
    return await this.moviesService.getPaginated(
      mediaType,
      page,
      20,
      user?.userId,
    );
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async updateMedia(
    @Param('id') id: string,
    @Body() body: Partial<UpdateMediaDTO>,
  ) {
    return await this.moviesService.updateMedia(id, body);
  }

  @Post('/seed')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async seedMedia(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('type') mediaType: MediaType | 'all' = 'all',
  ) {
    return await this.moviesService.seedFromTmdb(page, mediaType);
  }

  @Get('/me/favorites')
  @UseGuards(AuthGuard('jwt'))
  async getPaginatedFavorites(
    @CurrentUser() user: JwtUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('type') mediaType: MediaType | 'all' = 'all',
  ) {
    return await this.moviesService.getPaginatedFavorites(
      user.userId,
      mediaType,
      page,
    );
  }

  @Post('/:id/save')
  @UseGuards(AuthGuard('jwt'))
  async markAsFavorite(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return await this.moviesService.addFavorite(id, user.userId);
  }

  @Delete('/:id/save')
  @UseGuards(AuthGuard('jwt'))
  async unmarkAsFavorite(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
  ) {
    return await this.moviesService.removeFavorite(id, user.userId);
  }

  @Get('/search')
  async getSearched(@Query('q') query: string) {
    return await this.moviesService.searchFor(query);
  }

  @Get('/me/favorites/search')
  @UseGuards(AuthGuard('jwt'))
  async getSearchedFavorites(
    @CurrentUser() user: JwtUser,
    @Query('q') query: string,
  ) {
    return await this.moviesService.searchFavoritesFor(query, user.userId);
  }

  @Get('/admin/search')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getSearchedAdmin(@Query('q') query: string) {
    return await this.moviesService.dbSearch(query);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async deleteMedia(@Param('id') id: string) {
    return await this.moviesService.deleteMedia(id);
  }

  @Get('/:type/:id')
  @UseGuards(OptionalAuthGuard)
  async getSpecific(
    @CurrentUser() user: JwtUser | null,
    @Param('type') mediaType: MediaType,
    @Param('id') id: string,
  ) {
    return await this.moviesService.getDetails(id, mediaType, user?.userId);
  }
}
