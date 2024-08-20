import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { REFERER_STATUS } from '~/common/constants';

import type User from './user';

@plugin(autopopulate)
export default class UserReferral {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'User', required: true })
  public user!: Ref<User>;

  @prop({ type: String, unique: true, required: true })
  public referralCode!: string; // my 추천인 코드

  @prop({ type: Number, default: 1 })
  public level!: number; // 1=일반, 2=1대총판, 3=마스터계정

  @prop({ type: String, default: REFERER_STATUS.DISABLED })
  public status!: REFERER_STATUS;

  @prop({ autopopulate: { maxDepth: 3 }, ref: 'UserReferral' })
  public referral!: Ref<UserReferral>; // 상위 추천인

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
