import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { INQUIRY_TYPE } from '~/common/constants';

import type User from './user';

@plugin(autopopulate)
export default class Inquiry {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'User', required: true })
  public user!: Ref<User>;

  @prop({ type: String, required: true })
  public title!: string;

  @prop({ type: String, required: true })
  public content!: string;

  // @prop({ type: Array, default: [] })
  // public files!: object[];
  @prop({ type: String, default: '' })
  public image!: string;

  @prop({ type: String })
  public reply?: string;

  @prop({ type: String, default: INQUIRY_TYPE.INQUIRY })
  public status!: INQUIRY_TYPE;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
