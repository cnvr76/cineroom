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
      avatarUrl: u.avatarUrl,
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
      avatarUrl: user.avatarUrl,
    };
  }

  async getById(userId: string, full: boolean = false) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    return full ? this.buildFullUser(user) : this.toPublic(user);
  }

  async setAvatar(userId: string, avatarUrl: string) {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { avatarUrl } },
      { returnDocument: 'after' },
    );
    if (!updated) throw new NotFoundException(`User ${userId} not found`);
    return this.buildFullUser(updated);
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { returnDocument: 'after', runValidators: true },
    );
    if (!updated)
      throw new NotFoundException(`User with id ${userId} not found`);
    return this.buildFullUser(updated);
  }

  async searchUsers(query: string, limit: number = 20) {
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safe = escapeRegex(query);
    const users = await this.userModel
      .find({
        $or: [
          { username: { $regex: safe, $options: 'i' } },
          { email: { $regex: safe, $options: 'i' } },
        ],
      })
      .limit(limit)
      .lean();
    return users.map((u) => this.toPublic(u as unknown as UserDocument));
  }

  async deleteUser(userId: string) {
    const deleted = await this.userModel.findByIdAndDelete(userId);
    if (!deleted)
      throw new NotFoundException(`User with id ${userId} not found`);
    return { deleted: true };
  }

  async getAdminStats() {
    const [users, movies, tv] = await Promise.all([
      this.userModel.countDocuments(),
      this.movieModel.countDocuments({ mediaType: 'movie' }),
      this.movieModel.countDocuments({ mediaType: 'tv' }),
    ]);
    return {
      users,
      totalMedia: movies + tv,
      movies,
      tv,
    };
  }
}
