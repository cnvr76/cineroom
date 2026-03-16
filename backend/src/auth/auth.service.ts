import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { RegisterUserDTO, LoginUserDTO } from './dto/auth.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwt: JwtService,
  ) {}

  private toPublic(u: UserDocument) {
    return {
      id: u._id.toString(),
      username: u.username,
      email: u.email,
      role: u.role,
    };
  }

  async register({ username, email, password }: RegisterUserDTO) {
    const exists = await this.userModel.exists({ email });
    if (exists)
      throw new ConflictException(`User with email ${email} already exists`);

    const user = new this.userModel({ email, username });
    await user.setPassword(password);
    await user.save();
    return this.toPublic(user);
  }

  async login({ email, password }: LoginUserDTO) {
    const user = await this.userModel
      .findOne({ email })
      .select('+passwordHash');
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const valid = await user.checkPassword(password);
    if (!valid) throw new UnauthorizedException('Incorrect password');

    const payload = { sub: user._id.toString(), email: user.email };
    const token = await this.jwt.signAsync(payload);

    return { access_token: token };
  }
}
