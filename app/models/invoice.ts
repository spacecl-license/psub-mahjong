import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { INVOICE_STATUS } from '~/common/constants';

import type Receipt from './receipt';
import type UserAddress from './user-address';

@plugin(autopopulate)
export default class Invoice {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserAddress', required: true })
  public userAddress!: Ref<UserAddress>;

  @prop({ type: Number, default: 1 })
  public level!: number;

  @prop({ type: Number, default: 1 })
  public round!: number;

  @prop({ type: String, required: true })
  public psubPrice!: string;

  @prop({ type: String, required: true })
  public bnbPrice!: string;

  @prop({ type: String, required: true })
  public usdtPrice!: string;

  @prop({ autopopulate: true, ref: 'Receipt' })
  public receipt?: Ref<Receipt>;

  @prop({ type: String, default: INVOICE_STATUS.PENDING })
  public status!: INVOICE_STATUS;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public expiredAt?: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
