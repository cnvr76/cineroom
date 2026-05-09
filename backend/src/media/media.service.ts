import { Injectable, NotFoundException } from '@nestjs/common';
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
import type { UpdateMediaDTO } from './dto/media.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private movieModel: Model<Media>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly fetchService: FetchService,
    private readonly configService: ConfigService,
  ) {}

  async updateMedia(mediaId: string, data: Partial<UpdateMediaDTO>) {
    const media = await this.movieModel.findByIdAndUpdate(
      mediaId,
      { $set: data },
      { new: true },
    );
    if (!media) throw new NotFoundException(`Media ${mediaId} not found`);
    return media;
  }

  async addFavorite(mediaId: string, userId: string) {
    const exists = await this.movieModel.exists({ _id: mediaId });
    if (!exists) throw new NotFoundException(`Media ${mediaId} not found`);

    await this.userModel.updateOne(
      { _id: userId },
      { $addToSet: { favorites: mediaId } },
    );
    return { saved: true };
  }

  async removeFavorite(mediaId: string, userId: string) {
    await this.userModel.updateOne(
      { _id: userId },
      { $pull: { favorites: mediaId } },
    );
    return { saved: false };
  }

  async getPaginatedFavorites(
    userId: string,
    mediaType: MediaType | 'all',
    page: number = 1,
    batch: number = 20,
  ) {
    const user = await this.userModel
      .findById(userId)
      .select('favorites')
      .lean();
    if (!user) throw new NotFoundException('User not found');

    const filter: QueryFilter<Media> = { _id: { $in: user.favorites } };
    if (mediaType !== 'all') filter.mediaType = mediaType;

    return await this.movieModel
      .find(filter)
      .skip((page - 1) * batch)
      .sort({ releaseDate: -1 })
      .limit(batch)
      .lean();
  }

  async searchFor(query: string) {
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safe = escapeRegex(query);
    const dbMatches = await this.movieModel
      .find({ title: { $regex: safe, $options: 'i' } })
      .limit(20)
      .lean();

    if (dbMatches.length > 0) return dbMatches;

    const tmdbResponse = await this.fetchService.fetchSearch(query);
    const tmbdResults = tmdbResponse?.results || [];
    const tmbdMatches = tmbdResults.filter(
      (res) => res.media_type === 'movie' || res.media_type === 'tv',
    );

    if (tmbdMatches.length === 0) return [];
    await this.saveNewMedia(tmbdMatches);
    return this.movieModel
      .find({
        tmdbId: { $in: tmbdMatches.map((res) => res.id) },
      })
      .lean();
  }

  async getPaginated(
    mediaType: MediaType | 'all',
    page: number = 1,
    batch: number = 20,
    userId?: string,
  ) {
    const filter: QueryFilter<Media> = {};
    filter.mediaType =
      mediaType === 'all' ? { $in: ['movie', 'tv'] } : mediaType;

    const media = await this.movieModel
      .find(filter)
      .skip((page - 1) * batch)
      .sort({ releaseDate: -1 })
      .limit(batch)
      .lean();

    let favorites = new Set<string>();
    if (userId) {
      const user = await this.userModel
        .findById(userId)
        .select('favorites')
        .lean();
      favorites = new Set((user?.favorites ?? []).map((id) => id.toString()));
    }
    return media.map((m) => ({
      ...m,
      isSaved: favorites.has(m._id.toString()),
    }));
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
          const trailerKey =
            videoList.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
              ?.key ??
            videoList.find((v) => v.type === 'Teaser' && v.site === 'YouTube')
              ?.key;

          if (trailerKey) {
            updates.trailerKey = trailerKey;
            media.trailerKey = trailerKey;
          }
        });
      promises.push(trailerPromise);
      console.log(
        `Trailer fetching added for ${id} and mediaType: ${mediaType}`,
      );
    }

    if (promises.length > 0) await Promise.all(promises);

    if (Object.keys(updates).length > 0) {
      await this.movieModel.findByIdAndUpdate(id, { $set: updates });
    }

    return media;
  }

  private async getDominantColor(posterPath: string) {
    try {
      const imageBuffer = await this.fetchService.fetchPoster(posterPath);
      if (!imageBuffer) return DEFAULT_HEX;

      const palette = await Vibrant.from(imageBuffer).getPalette();
      return palette.Vibrant?.hex || DEFAULT_HEX;
    } catch (error) {
      console.error((error as Error).message);
      return DEFAULT_HEX;
    }
  }

  async seedFromTmdb(page: number, mediaType: MediaType | 'all' = 'all') {
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
    if (!entries || entries.length === 0)
      return { upserted: 0, modified: 0, total: 0 };

    const [movieGenres, tvGenres] = await Promise.all([
      this.fetchService.fetchGenres('tv'),
      this.fetchService.fetchGenres('movie'),
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

      const dominantColor = entry.poster_path
        ? await this.getDominantColor(entry.poster_path)
        : DEFAULT_HEX;

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
        dominantColor,
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
      const prepared = await Promise.all(preparedPromises);
      const result = await this.movieModel.bulkWrite(prepared);
      console.log(
        `Seeded ${prepared.length} media (upserted: ${result.upsertedCount}, modified: ${result.modifiedCount})`,
      );
      return {
        upserted: result.upsertedCount,
        modified: result.modifiedCount,
        total: prepared.length,
      };
    } catch (error) {
      console.error(
        'Error writing new media to database:',
        (error as Error).message,
      );
      return { upserted: 0, modified: 0, total: 0 };
    }
  }
}
