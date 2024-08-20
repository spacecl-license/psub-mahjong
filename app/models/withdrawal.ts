import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type { TOKEN } from '~/common/constants';
import { TRANSFER_STATUS } from '~/common/constants';

import type UserAddress from './user-address';
import type UserLedger from './user-ledger';

@plugin(autopopulate)
export default class Withdrawal {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserLedger' })
  public fromLedger?: Ref<UserLedger>;

  @prop({ autopopulate: true, ref: 'UserAddress' })
  public toUserAddress?: Ref<UserAddress>;

  @prop({ type: Number, default: 0.05 })
  public feeRate!: number;

  @prop({ type: String, required: true })
  public fee!: string;

  @prop({ type: String, required: true })
  public token!: TOKEN;

  @prop({ type: String, required: true })
  public amount!: string;

  @prop({ type: String, default: TRANSFER_STATUS.PENDING })
  public status!: TRANSFER_STATUS;

  @prop({ type: String })
  public chainNetworkId?: ChainNetworkId;

  @prop({ type: String })
  public txHash?: string;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
