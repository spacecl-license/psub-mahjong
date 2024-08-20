import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { LOTTERY_STATUS, LOTTERY_TYPE, TOKEN } from '~/common/constants';

import type ReservedTransfer from './reserved-transfer';
import type UserReferral from './user-referral';

@plugin(autopopulate)
export default class Lottery {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, required: true, ref: 'UserReferral' })
  public userReferral!: Ref<UserReferral>;

  @prop({ autopopulate: true,  ref: 'UserReferral' })
  public benefactor?: Ref<UserReferral>;

  @prop({ type: String, default: LOTTERY_TYPE.REFERRAL })
  public type!: LOTTERY_TYPE;

  @prop({ type: String, default: LOTTERY_STATUS.UNOPENED })
  public status!: LOTTERY_STATUS;

  @prop({ type: Number, integer: true, default: 1 })
  public month!: MonthLevel;

  @prop({ type: String, default: TOKEN.PSUB })
  public token!: TOKEN;

  @prop({ type: Number })
  public prizeRate?: number; // 총 지급 비

  @prop({ type: String })
  public prizeAmount?: string; // 지급할 수량 (Wei 단위)

  @prop({ autopopulate: true, ref: 'ReservedTransfer' })
  public reservedTransfer?: ReservedTransfer;

  @prop({ type: Array })
  public delayDays?: number[];

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
