import type { mongoose, Ref } from '@typegoose/typegoose';
import {
  modelOptions, plugin, prop, Severity,
} from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type { TOKEN } from '~/common/constants';

import type UserAddress from './user-address';

@plugin(autopopulate)
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export default class ChargeReceipt {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserAddress' })
  public userAddress?: Ref<UserAddress>;

  @prop({ type: String, required: true })
  public token!: TOKEN;

  @prop({ type: String, required: true })
  public paidAmount!: string;

  @prop({ type: String })
  public chainNetworkId?: ChainNetworkId;

  @prop({ type: String })
  public txHash?: string;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;
}
