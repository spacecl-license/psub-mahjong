import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { LEDGER_STATUS } from '~/common/constants';

import type User from './user';

@plugin(autopopulate)
export default class UserLedger {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'User', required: true })
  public user!: Ref<User>;

  @prop({ type: String, default: LEDGER_STATUS.IDLE })
  public status!: LEDGER_STATUS;

  @prop({ type: String, default: '0' })
  public psubBalance!: string;

  @prop({ type: String, default: '0' })
  public psubLock!: string;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
