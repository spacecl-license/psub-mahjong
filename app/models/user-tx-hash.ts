import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type User from './user';

@plugin(autopopulate)
export default class UserTxHash {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'User', required: true })
  public user!: Ref<User>;

  @prop({ type: String, required: true })
  public hash!: string;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
