import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Media, DEFAULT_HEX } from './schemas/media.schema';
import { Model, QueryFilter } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import type {
  ITmdbMovie,
  ITmdbTV,
  ITmmdbVideo,
  MediaType,
  TmdbResult,
} from './media.types';
import { FetchService } from 'src/fetch/fetch.service';
import { Vibrant } from 'node-vibrant/node';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private movieModel: Model<Media>,
    private readonly fetchService: FetchService,
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
      await this.getNewData(page, mediaType);
      media = await fetchdb();
    }

    return media;
  }

  async getDetails(id: string, mediaType: MediaType) {
    const media = await this.movieModel.findById(id).lean();
    if (!media) return {};

    const promises: Promise<void>[] = [];
    const updates: Record<string, any> = {};

    if (media.dominantColor === DEFAULT_HEX || !media.dominantColor) {
      const colorPromise = this.getDominantColor(media.posterPath).then(
        (color) => {
          media.dominantColor = color;
          updates.dominantColor = color;
        },
      );
      promises.push(colorPromise);
      console.log(`Color fetching added for ${id}`);
    }
    if (!media.trailerKey) {
      const trailerPromise = this.fetchService
        .fetchDetails(media.tmdbId, mediaType)
        .then((details) => {
          const videoList: ITmmdbVideo[] = details?.videos?.results || [];
          const trailerKey: string | undefined = videoList.find(
            (item) => item.type === 'Trailer',
          )?.key;

          if (trailerKey) {
            updates.trailerKey = trailerKey;
            media.trailerKey = trailerKey;
          }
        });
      promises.push(trailerPromise);
      console.log(`Trailer fetching added for ${id}`);
    }

    if (promises.length > 0) await Promise.all(promises);

    if (Object.keys(updates).length > 0)
      await this.movieModel.findByIdAndUpdate(id, { $set: updates });

    return media;
  }

  private async getDominantColor(posterPath: string) {
    const palette = await Vibrant.from(
      await this.fetchService.fetchPoster(posterPath),
    ).getPalette();

    return palette.Vibrant?.hex || DEFAULT_HEX;
  }

  private async getNewData(page: number, mediaType: MediaType | 'all' = 'all') {
    if (mediaType === 'all') {
      const [movies, tvs] = await Promise.all([
        this.fetchService.fetchMedia(page, 'movie'),
        this.fetchService.fetchMedia(page, 'tv'),
      ]);
      const combined = [...(movies?.results || []), ...(tvs?.results || [])];
      return await this.saveNewMedia(combined);
    } else {
      const other = await this.fetchService.fetchMedia(page, mediaType);
      return await this.saveNewMedia(other?.results);
    }
  }

  private async saveNewMedia(entries: TmdbResult[] | undefined) {
    if (!entries || entries.length === 0) return;

    const [movieGenres, tvGenres] = await Promise.all([
      this.fetchService.fetchGenres('tv'),
      this.fetchService.fetchGenres('movie'),
    ]);

    const prepared = entries.map((entry) => {
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

    try {
      await this.movieModel.bulkWrite(prepared);
      console.log(`Successfuly added ${prepared.length} new media`);
    } catch (error) {
      console.error('Error writing new media to database:', error.message);
    }
  }
}
