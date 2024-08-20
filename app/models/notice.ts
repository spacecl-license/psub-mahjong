import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type User from './user';

@plugin(autopopulate)
export default class Notice {
  _id?: mongoose.ObjectId;

  @prop({ type: String, required: true })
  public title!: string;

  @prop({ type: String, required: true })
  public content!: string;

  @prop({ autopopulate: true, ref: 'User' })
  public creator!: Ref<User>;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ autopopulate: true, ref: 'User' })
  public updator?: Ref<User>;

  @prop({ type: Date })
  public updatedAt?: Date;
}
