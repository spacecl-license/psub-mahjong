import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { TOKEN, TRANSFER_STATUS  } from '~/common/constants';

import Reward from './reward';

@plugin(autopopulate)
export default class Swap {
  _id?: mongoose.ObjectId;

  @prop({ type: Array, autopopulate: true, ref: () => Reward, default: [] })
  public rewards!: Ref<Reward>[];

  @prop({ type: String, default: TRANSFER_STATUS.PENDING })
  public status!: TRANSFER_STATUS;

  @prop({ type: Number, default: 0 })
  public feeRate!: number;

  @prop({ type: String, default: '0' })
  public fee!: string;

  @prop({ type: String, default: TOKEN.PSUB })
  public token!: TOKEN;

  @prop({ type: String, required: true })
  public amount!: string;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;
}
