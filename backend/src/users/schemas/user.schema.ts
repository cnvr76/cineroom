import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type RolesType = 'user' | 'admin';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: RolesType;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Media' }], default: [] })
  favorites: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
