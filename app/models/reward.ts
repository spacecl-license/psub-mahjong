import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { REWARD_STATUS } from '~/common/constants';

import type Box from './box';
import type UserReferral from './user-referral';

@plugin(autopopulate)
export default class Reward {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserReferral', required: true })
  public userReferral!: Ref<UserReferral>;

  @prop({ type: Number, default: 1 })
  public level!: number;

  @prop({ type: Number, default: 1 })
  public round!: number;

  @prop({ type: String, default: REWARD_STATUS.OWNED })
  public status!: REWARD_STATUS;

  @prop({ autopopulate: true, ref: 'Box' })
  public box?: Ref<Box>;

  // @prop({ type: Number, integer: true })
  // public rank?: RewardRank;

  @prop({ type: Number })
  public bonusRate?: RewardBonusRate;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
