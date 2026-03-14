import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const DEFAULT_HEX: string = '#000000';

@Schema({ timestamps: true })
export class Media extends Document {
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

  @Prop({ required: true })
  popularity: number;

  @Prop({ type: Date })
  releaseDate: Date;

  @Prop({ default: DEFAULT_HEX })
  dominantColor: string;
}

export const MovieSchema = SchemaFactory.createForClass(Media);
