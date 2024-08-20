import type { mongoose } from '@typegoose/typegoose';
import { prop } from '@typegoose/typegoose';

export default class CoinPrice {
  _id?: mongoose.Types.ObjectId;

  @prop({ type: String, required: true })
  public symbol!: string;

  @prop({ type: Number, required: true })
  public USD!: number;

  @prop({ type: Number, required: true })
  public CNY!: number;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;
}
