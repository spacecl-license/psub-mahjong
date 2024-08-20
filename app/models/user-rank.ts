import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type UserReferral from './user-referral';

@plugin(autopopulate)
export default class UserRank {
  _id!: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserReferral', required: true })
  public userReferral!: Ref<UserReferral>;

  @prop({ type: Number, required: true })
  public rank!: number;

  @prop({ type: String, required: true })
  public salesAmount!: string;

  @prop({ type: String, required: true })
  public incomeAmount!: string;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
