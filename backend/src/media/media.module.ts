import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MovieSchema } from './schemas/media.schema';
import { FetchModule } from 'src/fetch/fetch.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    FetchModule,
    MongooseModule.forFeature([
      { name: Media.name, schema: MovieSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
