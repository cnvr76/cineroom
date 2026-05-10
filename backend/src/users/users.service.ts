import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDTO } from './dto/users.dto';
import { Media } from 'src/media/schemas/media.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Media.name) private readonly movieModel: Model<Media>,
  ) {}

  private toPublic(u: UserDocument) {
    return {
      id: u._id.toString(),
      username: u.username,
      email: u.email,
      role: u.role,
    };
  }

  async getAll() {
    const list = await this.userModel.find().lean();
    return list.map((item) => this.toPublic(item));
  }

  private async buildFullUser(user: UserDocument) {
    const favorites = await this.movieModel
      .find({ _id: { $in: user.favorites } })
      .select('mediaType')
      .lean();

    const moviesCount = favorites.filter(
      (fav) => fav.mediaType === 'movie',
    ).length;
    const tvCount = favorites.filter((fav) => fav.mediaType === 'tv').length;

    return {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      email: user.email,
      favoriteCount: favorites.length,
      moviesCount,
      tvCount,
      joinedAt: (user as any).createdAt?.toISOString() ?? '',
    };
  }

  async getById(userId: string, full: boolean = false) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    return full ? this.buildFullUser(user) : this.toPublic(user);
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true },
    );
    if (!updated)
      throw new NotFoundException(`User with id ${userId} not found`);
    return this.buildFullUser(updated);
  }
}
