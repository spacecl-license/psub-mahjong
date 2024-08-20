import type { mongoose } from '@typegoose/typegoose';
import { prop } from '@typegoose/typegoose';

export default class User {
  _id?: mongoose.ObjectId;

  @prop({ type: String, unique: true, required: true })
  public id!: string;

  @prop({ type: String })
  public email?: string;

  @prop({ type: Boolean, default: true })
  public isSignedTermsAndConditions!: boolean;

  @prop({ type: Boolean, default: false })
  public isAdmin!: boolean;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public updatedAt?: Date;
}
