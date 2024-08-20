import type { mongoose, Ref } from '@typegoose/typegoose';
import {
  modelOptions, plugin, prop, Severity,
} from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import type User from './user';

@plugin(autopopulate)
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export default class Log {
  _id?: mongoose.ObjectId;

  @prop({ type: String, required: true })
  public type!: LogType;

  @prop({ type: String, required: true })
  public code!: string;

  @prop({ type: String, required: true })
  public ip!: string;

  @prop({ type: String, required: true })
  public url!: string;

  @prop({ type: String, required: true })
  public pathName!: string;

  @prop({ type: String, required: true })
  public method!: string;

  @prop({ type: Object, required: true })
  public headers!: any;

  @prop({ type: Object })
  public searchParams?: any;

  @prop({ type: Object })
  public body?: any;

  @prop({ type: Object })
  public formData?: any;

  @prop({ autopopulate: true, ref: 'User' })
  public user?: Ref<User>;

  @prop({ type: String })
  public message?: string;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;
}
