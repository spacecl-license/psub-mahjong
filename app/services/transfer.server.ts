import { json } from '@remix-run/node';
import bcrypt from 'bcrypt';
import { BigNumber, utils } from 'ethers';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';

import { LEDGER_STATUS, TOKEN } from '~/common/constants';
import {
  TransferModel, UserAddressModel, UserLedgerModel, UserModel, UserTxHashModel,
} from '~/models';

import dbConnect from './db.server';
import { getLedgerBalance } from './ledger.server';

export async function sendTransaction(recipientId: string, userId : ObjectId, amount: string, feeRate : number, transactionPassword : string) {
  await dbConnect();

  // 수신자 정보 조회
  if (!recipientId) throw new Error('Recipient user not found');
  const recipientUser = await UserModel.findOne({ id : recipientId });
  if (!recipientUser) throw new Error('Recipient user not found');
  let recipientLedger = await UserLedgerModel.findOne({ user: recipientUser });

  // 사용자 및 지갑 정보 조회
  const user = await UserModel.findById(userId);

  const userWallet = await UserAddressModel.findOne({ user });

  if (!userWallet) throw new Error('user wallet not found');

  let userLedger = await UserLedgerModel.findOne({ user });

  if (!userLedger) {
    throw new Error('user ledger not found');
  }

  if (String(userLedger._id) === String(recipientLedger._id)) {
    throw new Error('Can not send to yourself');
  }

  // * ledger가 IDLE이 아닐때 조기 종료
  if (recipientLedger.status !== LEDGER_STATUS.IDLE && userLedger.status !== LEDGER_STATUS.IDLE) {
    return json({ path : 'userLedger',
      error: `target ledger status is ${recipientLedger!.status},${userLedger.status}. can not use ledger.` },
    { status: 403 });
  }

  if (transactionPassword === ''){
    throw new Error('Please verify your email');
  }

  // * 트랜잭션 비밀번호 확인
  const transactionPasswordHash = await UserTxHashModel.findOne({ user : user._id });

  const check = bcrypt.compareSync(transactionPassword as string, transactionPasswordHash.hash);

  if (!check) {
    throw new Error('Transaction password is incorrect');
  }

  const psubBalance = await getLedgerBalance(user!._id!);
  const amountInWei = utils.parseUnits(amount, 'ether');

  if (amountInWei.gt(psubBalance)) {
    throw new Error('Insufficient balance');
  }

  const fee = BigNumber.from(amountInWei).div(20);
  const sendAmount = BigNumber.from(amountInWei).sub(fee);

  // 트랜잭션 생성
  const transfer = await TransferModel.create({
    fromLedger: userLedger,
    toLedger: recipientLedger,
    feeRate: feeRate / 100,
    fee: fee.toString(),
    token: TOKEN.PSUB,
    amount : sendAmount.toString(),
    status: 'pending',
    createdAt: new Date(),
  });
  // DB 세션 시작
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    recipientLedger = await UserLedgerModel.findOne({ user: recipientUser }).session(session);
    userLedger = await UserLedgerModel.findOne({ user }).session(session);

    // * Ledger SUBMITTING 상태로
    recipientLedger.status = LEDGER_STATUS.SUBMITTING;
    recipientLedger.updatedAt = new Date();
    userLedger.status = LEDGER_STATUS.SUBMITTING;
    userLedger.updatedAt = new Date();

    // 잔액 업데이트
    const psubBalance = BigNumber.from(recipientLedger.psubBalance).add(sendAmount);
    recipientLedger.psubBalance = psubBalance.toString();
    recipientLedger.status = LEDGER_STATUS.IDLE;
    recipientLedger.updatedAt = new Date();

    const userPsubBalance = BigNumber.from(userLedger.psubBalance).sub(amountInWei);
    userLedger.psubBalance = userPsubBalance.toString();
    userLedger.status = LEDGER_STATUS.IDLE;
    userLedger.updatedAt = new Date();

    // 트랜잭션 상태 변경
    transfer.status = 'confirmed';

    await recipientLedger.save({ session });
    await userLedger.save({ session });
    await transfer.save({ session });

    // 커밋 및 세션 종료
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
    recipientLedger.status = LEDGER_STATUS.IDLE;
    recipientLedger.updatedAt = new Date();
    userLedger.status = LEDGER_STATUS.IDLE;
    userLedger.updatedAt = new Date();
  }
}
