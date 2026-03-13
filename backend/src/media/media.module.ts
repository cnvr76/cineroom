import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MovieSchema } from './schemas/media.schema';
import { FetchModule } from 'src/fetch/fetch.module';

@Module({
  imports: [
    FetchModule,
    MongooseModule.forFeature([{ name: Media.name, schema: MovieSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
