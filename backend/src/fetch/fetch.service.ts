import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MediaType, ITmdbResponse } from 'src/media/media.types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FetchService {
  private readonly APIKEY: string | undefined;
  private readonly BASE_URL: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.APIKEY = this.configService.get<string>('TMDB_APIKEY');
    this.BASE_URL = this.configService.get<string>('BASE_URL');
  }

  async fetchDetails(tmdbId: number, mediaType: MediaType) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.BASE_URL}/${mediaType}/${tmdbId}?api_key=${this.APIKEY}&append_to_response=videos`,
        ),
      );
      return data;
    } catch (error) {
      console.error(
        'Error while attempting to fetch TMDB (details):',
        error.message,
      );
    }
  }

  async fetchMedia(page: number, mediaType: MediaType) {
    try {
      const { data }: { data: ITmdbResponse } = await firstValueFrom(
        this.httpService.get(
          `${this.BASE_URL}/trending/${mediaType}/day?api_key=${this.APIKEY}&page=${page}&append_to_response=videos,images`,
        ),
      );
      // console.log(data);
      return data;
    } catch (error) {
      console.error(
        'Error while attempting to fetch TMDB (media):',
        error.message,
      );
    }
  }

  async fetchGenres(mediaType: MediaType): Promise<Record<number, string>> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.BASE_URL}/genre/${mediaType}/list?api_key=${this.APIKEY}`,
        ),
      );
      return data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
    } catch (error) {
      console.error(
        'Error while attempting to fetch TMDB (genres):',
        error.message,
      );
      return {};
    }
  }
}
