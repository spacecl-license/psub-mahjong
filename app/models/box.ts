import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { BOX_STATUS } from '~/common/constants';

import type UserReferral from './user-referral';

@plugin(autopopulate)
export default class Box {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserReferral', required: true })
  public userReferral!: Ref<UserReferral>;

  @prop({ type: Number, integer: true, default: 0 })
  public jan!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public feb!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public mar!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public apr!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public may!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public jun!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public jul!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public aug!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public sep!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public oct!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public nov!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public dec!: number;

  @prop({ type: Number, integer: true, default: 0 })
  public janTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public febTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public marTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public aprTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public mayTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public junTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public julTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public augTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public sepTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public octTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public novTicket?: number;

  @prop({ type: Number, integer: true, default: 0 })
  public decTicket?: number;

  @prop({ type: Boolean, default: false })
  public isAutoBetting!: boolean;

  @prop({ type: String, default: BOX_STATUS.IDLE })
  public status!: BOX_STATUS;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;

  @prop({ type: Date })
  public lastPurchasedAt?: Date;

  @prop({ type : Number, default : 0 })
  public dailyPurchaseCount?: number;
}
