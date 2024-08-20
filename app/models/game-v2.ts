import type { mongoose, Ref } from '@typegoose/typegoose';
import { plugin, prop } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

import { GAME_STATUS } from '~/common/constants';

import type UserReferral from './user-referral';

@plugin(autopopulate)
export default class GameV2 {
  _id!: mongoose.ObjectId;

  @prop({ autopopulate: true, ref: 'UserReferral', required: true })
  public userReferral!: Ref<UserReferral>;

  @prop({ type: Number, default: 1 })
  public level!: number;

  @prop({ type: Number, default: 1 })
  public round!: number;

  @prop({ type: Array, autopopulate: { maxDepth: 5 }, ref: () => GameV2, default: [] })
  public children!: Ref<GameV2>[];

  @prop({ type: String, default: GAME_STATUS.PLAYING })
  public status!: GAME_STATUS;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
