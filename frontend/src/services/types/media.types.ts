export interface IMediaBrief {
  _id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  mediaType: "movie" | "tv";
  genres: string[];
  rating: number;
  popularity: number;
  releaseDate: string;
  dominantColor: string;

  createdAt: string;
  updatedAt: string;
}

export interface IMediaFull extends IMediaBrief {
  trailerKey: string | null;

  runtime?: number;
  endYear?: number | null;
  numberOfSeasons?: number;
}
