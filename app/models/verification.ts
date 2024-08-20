import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { EMAIL_STATUS, VERIFICATION_TYPE  } from '~/common/constants';

import type User from './user';

@plugin(autopopulate)
export default class Verification {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'User' })
  public user?: Ref<User>;

  @prop({ type: String, required: true })
  public email!: string;

  @prop({ type: String, required: true })
  public code!: string;

  @prop({ type: String, required: true, default: VERIFICATION_TYPE.REGISTER })
  public type!: VERIFICATION_TYPE;

  @prop({ type: String, default: EMAIL_STATUS.WAITING })
  public status!: EMAIL_STATUS;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
