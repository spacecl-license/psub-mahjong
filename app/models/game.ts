import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { GAME_STATUS } from '~/common/constants';

import type UserReferral from './user-referral';

@plugin(autopopulate)
export default class Game {
  _id?: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserReferral', required: true })
  public userReferral!: Ref<UserReferral>;

  @prop({ type: Number, default: 1 })
  public level!: number;

  @prop({ type: Number, default: 1 })
  public round!: number;

  @prop({ autopopulate: true, ref: 'Game' })
  public left?: Ref<Game>;

  @prop({ autopopulate: true, ref: 'Game' })
  public right?: Ref<Game>;

  @prop({ type: String, default: GAME_STATUS.PLAYING })
  public status!: GAME_STATUS;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
