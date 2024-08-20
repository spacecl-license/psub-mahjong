import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { RESERVED_TRANSFER_STATUS, TOKEN  } from '~/common/constants';

import type UserLedger from './user-ledger';

@plugin(autopopulate)
export default class ReservedTransfer {
  _id?: mongoose.ObjectId;

  @prop({ required: true, autopopulate: true, ref: 'UserLedger' })
  public toLedger!: Ref<UserLedger>;

  @prop({ type: Number, integer: true, default: 1 })
  public month!: MonthLevel;

  @prop({ type: String, default: RESERVED_TRANSFER_STATUS.RESERVED })
  public status!: RESERVED_TRANSFER_STATUS;

  @prop({ type: String, default: TOKEN.PSUB })
  public token!: TOKEN;

  @prop({ type: String, required: true })
  public amount!: string; // 지급할 수량 (Wei 단위)

  @prop({ type: Date, required: true })
  public transferTime!: Date;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;

  @prop({ type: Date })
  public transferredAt?: Date;
}
