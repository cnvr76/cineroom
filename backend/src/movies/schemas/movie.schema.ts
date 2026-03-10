import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Movie extends Document {
  @Prop({ required: true, unique: true, index: true })
  tmdbId: number;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  overview: string;

  @Prop({ required: true })
  posterPath: string;

  @Prop({ required: true, enum: ['movie', 'tv'] })
  mediaType: string;

  @Prop({ default: null })
  trailerKey: string;

  @Prop({ type: [String], default: [] })
  genres: string[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ type: Date })
  releaseDate: Date;

  @Prop({ default: '#000000' })
  dominantColor: string;

  @Prop({ index: true })
  page: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
