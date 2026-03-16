import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);

export type UserDocument = HydratedDocument<User> & {
  setPassword(password: string): Promise<void>;
  checkPassword(password: string): Promise<boolean>;
};

export type RolesType = 'user' | 'admin';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ type: String })
  salt: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: RolesType;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Media' }], default: [] })
  favorites: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.setPassword = async function (
  this: UserDocument,
  password: string,
): Promise<void> {
  this.salt = randomBytes(32).toString();
  this.passwordHash = (
    await pbkdf2Async(password, this.salt, 100000, 64, 'sha256')
  ).toString('hex');
};

UserSchema.methods.checkPassword = async function (
  this: UserDocument,
  password: string,
): Promise<boolean> {
  const hash = (
    await pbkdf2Async(password, this.salt, 100000, 64, 'sha256')
  ).toString('hex');
  return this.passwordHash === hash;
};
