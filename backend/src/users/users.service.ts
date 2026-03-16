import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterUserDTO } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

  async getById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return this.toPublic(user);
  }
}
