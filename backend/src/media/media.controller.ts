import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaType } from './media.types';

@Controller('media')
export class MediaController {
  constructor(private readonly moviesService: MediaService) {}

  @Get()
  findOne(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('type') mediaType: MediaType | 'all' = 'all',
  ) {
    return this.moviesService.getPaginated(mediaType, page);
  }
}
