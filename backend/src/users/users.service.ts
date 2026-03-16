import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/users.dto';

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

  async create({ email, username, password }: CreateUserDTO) {
    const exists = await this.userModel.exists({ email });
    if (exists)
      throw new ConflictException(`User with email ${email} already exists`);

    const user = new this.userModel({ email, username });
    await user.setPassword(password);
    await user.save();
    return this.toPublic(user);
  }

  async getAll() {
    const list = await this.userModel.find().lean();
    return list.map((item) => this.toPublic(item));
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) return new NotFoundException(`User with id ${id} not found`);
    return this.toPublic(user);
  }
}
