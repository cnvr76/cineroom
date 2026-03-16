import type { MediaType } from '../media.types';

export interface UpdateMediaDTO {
  title: string;
  overview: string;
  rating: number;
  mediaType: MediaType;
  dominantColor: string;
}
