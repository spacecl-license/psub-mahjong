/* eslint-disable padding-line-between-statements */
import { getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';

import Box from './box';
import BoxBetting, { Player } from './box-betting';
import BoxReceipt from './box-receipt';
import ChargeInvoice from './charge-invoice';
import ChargeReceipt from './charge-receipt';
import CoinPrice from './coin';
import Game from './game';
import GameV2 from './game-v2';
import Inquiry from './inquiry';
import Invoice from './invoice';
import Log from './log';
import Lottery from './lottery';
import Notice from './notice';
import Receipt from './receipt';
import ReservedTransfer from './reserved-transfer';
import Reward from './reward';
import Transfer from './transfer';
import User from './user';
import UserAddress from './user-address';
import UserHash from './user-hash';
import UserLedger from './user-ledger';
import UserRank from './user-rank';
import UserReferral from './user-referral';
import UserTxHash from './user-tx-hash';
import Verification from './verification';
import Withdrawal from './withdrawal';

export const UserModel = mongoose.models.User || getModelForClass(User);
export const UserHashModel =
  mongoose.models.UserHash || getModelForClass(UserHash);
export const UserAddressModel =
  mongoose.models.UserAddress || getModelForClass(UserAddress);
export const UserReferralModel =
  mongoose.models.UserReferral || getModelForClass(UserReferral);
export const UserLedgerModel =
  mongoose.models.UserLedger || getModelForClass(UserLedger);
export const VerificationModel =
  mongoose.models.Verification || getModelForClass(Verification);
export const GameModel = mongoose.models.Game || getModelForClass(Game);
export const GameV2Model = mongoose.models.GameV2 || getModelForClass(GameV2);
export const RewardModel = mongoose.models.Reward || getModelForClass(Reward);
export const TransferModel =
  mongoose.models.Transfer || getModelForClass(Transfer);
export const WithdrawalModel =
  mongoose.models.Withdrawal || getModelForClass(Withdrawal);
export const InvoiceModel =
  mongoose.models.Invoice || getModelForClass(Invoice);
export const ReceiptModel =
  mongoose.models.Receipt || getModelForClass(Receipt);
export const ChargeInvoiceModel =
  mongoose.models.ChargeInvoice || getModelForClass(ChargeInvoice);
export const ChargeReceiptModel =
  mongoose.models.ChargeReceipt || getModelForClass(ChargeReceipt);
export const NoticeModel = mongoose.models.Notice || getModelForClass(Notice);
export const CoinPriceModel =
  mongoose.models.CoinPrice || getModelForClass(CoinPrice);
export const LogModel = mongoose.models.Log || getModelForClass(Log);
export const InquiryModel =
  mongoose.models.Inquiry || getModelForClass(Inquiry);
export const UserTxHashModel =
  mongoose.models.UserTxHash || getModelForClass(UserTxHash);
export const BoxModel = mongoose.models.Box || getModelForClass(Box);
export const BoxBettingModel =
  mongoose.models.BoxBetting || getModelForClass(BoxBetting);
export const PlayerModel = mongoose.models.Player || getModelForClass(Player);
export const LotteryModel =
  mongoose.models.Lottery || getModelForClass(Lottery);
export const ReservedTransferModel =
  mongoose.models.ReservedTransfer || getModelForClass(ReservedTransfer);
export const BoxReceiptModel =
  mongoose.models.BoxReceipt || getModelForClass(BoxReceipt);
export const UserRankModel =
  mongoose.models.UserRank || getModelForClass(UserRank);
