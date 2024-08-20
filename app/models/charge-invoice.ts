import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type { TOKEN } from '~/common/constants';
import { INVOICE_STATUS } from '~/common/constants';

import type Receipt from './receipt';
import type UserAddress from './user-address';

@plugin(autopopulate)
export default class ChargeInvoice {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserAddress', required: true })
  public userAddress!: Ref<UserAddress>;

  @prop({ type: String, required: true })
  public token!: TOKEN;

  @prop({ type: String, required: true })
  public quantity!: string;

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
