import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Media } from './schemas/media.schema';
import { Model, QueryFilter } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type {
  ITmdbMovie,
  ITmdbResponse,
  ITmdbTV,
  MediaType,
  TmdbResult,
} from './media.types';

@Injectable()
export class MediaService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Media.name) private movieModel: Model<Media>,
    private readonly configService: ConfigService,
  ) {}

  async getPaginated(
    mediaType: MediaType | 'all',
    page: number = 1,
    batch: number = 20,
    forgiveMissing: number = 2,
  ) {
    const filter: QueryFilter<Media> = {};
    filter.mediaType =
      mediaType === 'all' ? { $in: ['movie', 'tv'] } : mediaType;

    const fetchdb = () =>
      this.movieModel
        .find(filter)
        .skip((page - 1) * batch)
        .sort({ releaseDate: -1 })
        .limit(batch)
        .lean();

    let media = await fetchdb();

    if (media.length < batch - forgiveMissing) {
      const newMedia = await this.getNewData(page, mediaType);
      media = await fetchdb();
    }

    return media;
  }

  private async getNewData(page: number, mediaType: MediaType | 'all' = 'all') {
    if (mediaType === 'all') {
      const [movies, tvs] = await Promise.all([
        this.fetchMedia(page, 'movie'),
        this.fetchMedia(page, 'tv'),
      ]);
      const combined = [...(movies?.results || []), ...(tvs?.results || [])];
      return await this.save(combined);
    } else {
      const other = await this.fetchMedia(page, mediaType);
      return await this.save(other?.results);
    }
  }

  private async save(entries: TmdbResult[] | undefined) {
    if (!entries || entries.length === 0) return;

    const [movieGenres, tvGenres] = await Promise.all([
      await this.fetchGenres('movie'),
      await this.fetchGenres('tv'),
    ]);

    const preparedPromises = entries.map(async (entry) => {
      const isMovie: boolean = entry.media_type === 'movie';
      const genres = isMovie ? movieGenres : tvGenres;

      const title = isMovie
        ? (entry as ITmdbMovie).title
        : (entry as ITmdbTV).name;

      const releaseDate = new Date(
        isMovie
          ? (entry as ITmdbMovie).release_date
          : (entry as ITmdbTV).first_air_date,
      );

      const document = {
        tmdbId: entry.id,
        mediaType: entry.media_type,
        title,
        overview: entry.overview,
        posterPath: entry.poster_path,
        genres: entry.genre_ids.map((gid) => genres[gid]) || [],
        rating: entry.vote_average,
        popularity: entry.popularity,
        releaseDate,
      };

      return {
        updateOne: {
          filter: { tmdbId: entry.id },
          update: { $set: document },
          upsert: true,
        },
      };
    });

    const prepared = await Promise.all(preparedPromises);

    try {
      await this.movieModel.bulkWrite(prepared);
      console.log(`Successfuly added ${prepared.length} new media`);
    } catch (error) {
      console.error('Error writing new media to database:', error.message);
    }
  }

  private async fetchMedia(page: number, mediaType: MediaType) {
    const baseUrl = this.configService.get('TRENDING_URL');
    const key = this.configService.get('TMDB_APIKEY');

    try {
      const { data }: { data: ITmdbResponse } = await firstValueFrom(
        this.httpService.get(
          `${baseUrl}/${mediaType}/day?api_key=${key}&page=${page}&append_to_response=videos,images`,
        ),
      );
      // console.log(data);
      return data;
    } catch (error) {
      console.error('Error while attempting to fetch TMDB:', error.message);
    }
  }

  private async fetchGenres(
    mediaType: MediaType,
  ): Promise<Record<number, string>> {
    const baseUrl = this.configService.get('GENRES_URL');
    const key = this.configService.get('TMDB_APIKEY');

    const { data } = await firstValueFrom(
      this.httpService.get(`${baseUrl}/${mediaType}/list?api_key=${key}`),
    );

    // Превращаем массив [{id: 28, name: "Action"}] в объект { 28: "Action" }
    return data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  }
}
