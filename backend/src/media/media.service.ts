import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/media.schema';
import { Model, QueryFilter } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { ITmdbResponse, MediaType } from './media.types';

@Injectable()
export class MediaService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    private readonly configService: ConfigService,
  ) {}

  async getPaginated(
    mediaType: MediaType | 'all',
    page: number = 1,
    batch: number = 20,
  ) {
    const filter: QueryFilter<Movie> = {};
    filter.mediaType =
      mediaType === 'all' ? { $in: ['movie', 'tv'] } : mediaType;

    const movies = await this.movieModel
      .find(filter)
      .skip((page - 1) * batch)
      .sort({ releaseDate: -1 })
      .limit(batch)
      .lean();

    return movies;
  }

  private async getMoviesAPI(page: number) {
    const baseUrl = this.configService.get('TRENDING_MOVIES_URL');
    const key = this.configService.get('TMDB_APIKEY');

    try {
      const { data }: { data: ITmdbResponse } = await firstValueFrom(
        this.httpService.get(`${baseUrl}${key}&page=${page}`),
      );
      // console.log(data);
      return data;
    } catch (error) {
      console.error('Error while attempting to fetch TMDB:', error.message);
    }
  }
}
