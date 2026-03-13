export type MediaType = 'movie' | 'tv';

interface ITmdbBase {
  id: number;
  backdrop_path: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  popularity: number;
  vote_average: number;
}

export interface ITmdbMovie extends ITmdbBase {
  media_type: 'movie';
  title: string;
  original_title: string;
  release_date: string;
}

export interface ITmdbTV extends ITmdbBase {
  media_type: 'tv';
  name: string;
  original_name: string;
  first_air_date: string;
}

export type TmdbResult = ITmdbMovie | ITmdbTV;

export interface ITmdbResponse {
  page: number;
  results: TmdbResult[];
  total_pages: number;
  total_results: number;
}
