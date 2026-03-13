import { Controller, Get, Query, ParseIntPipe, Param } from '@nestjs/common';
import { MediaService } from './media.service';
import type { MediaType } from './media.types';

@Controller('media')
export class MediaController {
  constructor(private readonly moviesService: MediaService) {}

  @Get()
  async getAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('type') mediaType: MediaType | 'all' = 'all',
  ) {
    return await this.moviesService.getPaginated(mediaType, page);
  }

  @Get('/:type/:id')
  async getSpecific(
    @Param('type') mediaType: MediaType,
    @Param('id') id: string,
  ) {
    return await this.moviesService.getDetails(id, mediaType);
  }
}
