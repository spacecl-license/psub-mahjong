import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type { TOKEN } from '~/common/constants';

import type UserLedger from './user-ledger';

@plugin(autopopulate)
export default class BoxReceipt {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserLedger' })
  public userLedger!: Ref<UserLedger>;

  @prop({ type: Number, required: true })
  public month!: number;

  @prop({ type: String, required: true })
  public token!: TOKEN;

  @prop({ type: String, required: true })
  public amount!: string;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;
}
