import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type { BOX_BETTING_TYPE } from '~/common/constants';
import { BOX_BETTING_STATUS } from '~/common/constants';

import type Box from './box';
import type ReservedTransfer from './reserved-transfer';

@plugin(autopopulate)
export class Player {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'Box' })
  public box!: Ref<Box>;

  @prop({ type: Date })
  public lastPing?: Date;

  @prop({ type: Boolean, default: false })
  public isSeenCount!: boolean;

  @prop({ type: Number, integer: true, default: 0 })
  public rank!: number;

  @prop({ type: Number, default: 0 })
  public rewardRate!: number; // 리워드 보너스 비율
}

@plugin(autopopulate)
export default class BoxBetting {
  _id?: mongoose.ObjectId;

  @prop({ type: String, required: true })
  public type!: BOX_BETTING_TYPE;

  @prop({ type: Number, integer: true, default: 1 })
  public month!: MonthLevel;

  @prop({ type: String, default: BOX_BETTING_STATUS.SEARCHING })
  public status!: BOX_BETTING_STATUS;

  @prop({ autopopulate : true, type: Array, default: [] })
  public players!: Player[];

  @prop({ autopopulate: true, ref: 'Player' })
  public winnerPlayer?: Player;

  @prop({ type: String })
  public prizeAmount?: string; // 승리 상금 (Wei)

  @prop({ autopopulate: true, ref: 'ReservedTransfer' })
  public reservedTransfer?: ReservedTransfer; // 게임 종료 후 예약된 psub 지급

  @prop({ type: Array })
  public delayDays?: number[];

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;

  @prop({ type: Date })
  public matchedAt?: Date;

  @prop({ type: Date })
  public endedAt?: Date;
}
