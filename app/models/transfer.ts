import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type { TOKEN } from '~/common/constants';
import { TRANSFER_STATUS } from '~/common/constants';

import type UserLedger from './user-ledger';
import type UserReferral from './user-referral';

@plugin(autopopulate)
export default class Transfer {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserLedger' })
  public fromLedger?: Ref<UserLedger>;

  @prop({ autopopulate: true, ref: 'UserLedger' })
  public toLedger?: Ref<UserLedger>;

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

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;

  @prop({ autopopulate: true, ref: 'UserReferral' })
  public userReferral?: Ref<UserReferral>;
}
