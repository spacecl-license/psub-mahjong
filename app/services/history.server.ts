import type { ObjectId } from 'mongoose';

import { ReceiptModel } from '~/models';
import type Receipt from '~/models/receipt';

import dbConnect from './db.server';

export const getReceipts = async (userAddress_id: ObjectId | string) => {
  await dbConnect();
  return ReceiptModel.find<Receipt>({ userAddress: userAddress_id }).sort({ createdAt: -1 });
};
