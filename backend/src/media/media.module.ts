import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schemas/media.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
