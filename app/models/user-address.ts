import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type User from './user';

@plugin(autopopulate)
export default class UserAddress {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'User', required: true })
  public user!: Ref<User>;

  @prop({ type: String, unique: true, required: true })
  public bnbAddress!: string;

  @prop({ type: String, unique: true, required: true })
  public psubAddress!: string;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
