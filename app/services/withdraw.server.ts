import { json } from '@remix-run/node';
import bcrypt from 'bcrypt';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

import { LEDGER_STATUS, TOKEN, TRANSFER_STATUS } from '~/common/constants';
import {
  UserAddressModel, UserLedgerModel/* , VerificationModel */, UserTxHashModel, WithdrawalModel,
} from '~/models';
import type User from '~/models/user';
import type UserAddress from '~/models/user-address';
import type UserLedger from '~/models/user-ledger';

import dbConnect from './db.server';
import { handleError, log } from './log.server';
import { getUser } from './session.server';

export const config = {
  maxDuration: 270,
};

export const withdraw = async (request: Request) => {
  try {
    const formData = await request.formData();
    const quantity = formData.get('quantity');
    const transactionPassword = formData.get('transactionPassword');
    // const code = formData.get('code');

    if (!quantity) {
      return json<ErrorData>({
        path: 'quantity',
        error: 'quantity must required.',
      }, { status: 403 });
    }

    if (!transactionPassword) {
      return json<ErrorData>({
        path: 'transactionPassword',
        error: 'transactionPassword must required.',
      }, { status: 403 });
    }

    // if (!code) {
    //   return json<ErrorData>({
    //     path: 'code',
    //     error: 'code must required.',
    //   }, { status: 403 });
    // }

    const user = await getUser(request);
    const db = await dbConnect();

    // const verification = await VerificationModel.findOne({
    //   email: user!.email,
    //   status: EMAIL_STATUS.WAITING,
    // }).sort({ createdAt: -1 });

    // // TODO: 이메일 코드 만료일 계산
    // if (!verification) {
    //   return json<ErrorData>({
    //     path: 'verification',
    //     error: 'verification not founded.',
    //   }, { status: 403 });
    // }

    // if (verification.code !== code) {
    //   return json<ErrorData>({
    //     path: 'verification',
    //     error: 'verification code not matched.',
    //   }, { status: 403 });
    // }

    // verification.status = EMAIL_STATUS.VERIFIED;
    // verification.updatedAt = new Date();
    // await verification.save();

    // * 트랜잭션 비밀번호 확인
    const transactionPasswordHash = await UserTxHashModel.findOne({ user : user!._id });

    const check = bcrypt.compareSync(transactionPassword as string, transactionPasswordHash.hash);

    if (!check) {
      return json<ErrorData>({
        path: 'transactionPassword',
        error: 'transaction password is incorrect.',
      }, { status: 403 });
    }

    const ledger = await UserLedgerModel.findOne<UserLedger>({ user });

    // * ledger가 IDLE이 아닐때 조기 종료
    if (ledger!.status !== LEDGER_STATUS.IDLE) {
      return json<ErrorData>({
        path: 'userLedger',
        error: `target ledger status is ${ledger!.status}. can not use ledger.`,
      }, { status: 403 });
    }

    // * Ledger SUBMITTING 상태로
    ledger!.status = LEDGER_STATUS.SUBMITTING;
    ledger!.updatedAt = new Date();
    (ledger! as unknown as any).save();

    const session = await db.startSession();
    const userLedger = await UserLedgerModel.findOne<UserLedger>({ user }).session(session);
    const userAddress = await UserAddressModel.findOne<UserAddress>({ user }).session(session);

    const psubBalance = BigNumber.from(userLedger!.psubBalance);
    const sendAmount = parseEther((quantity as string)!);
    const fee = sendAmount.div(20);

    try {
      session.startTransaction();

      if (sendAmount.gt(psubBalance)) {
        return json<ErrorData>({
          error: 'psub is not enough for withdraw.',
        }, { status: 403 });
      }

      const privateKey = process.env.PRIVATE_KEY;

      if (!privateKey) {
        throw Error('Please define the PRIVATE_KEY environment variable');
      }

      const withdrawAddress = process.env.WITHDRAW_ADDRESS;

      if (!withdrawAddress) {
        throw Error('Please define the WITHDRAW_ADDRESS environment variable');
      }

      // const provider = new providers.JsonRpcProvider(KLAYTN_NETWORK.rpcUrls[0]);
      // const account = new ethers.Wallet(privateKey);
      // const signer = account.connect(provider);
      // const sdk = ThirdwebSDK.fromSigner(signer);
      // const contract = await sdk.getContract(PSUB_CA);

      // contract.erc20.transferFrom(
      //   withdrawAddress,
      //   userAddress!.psubAddress,
      //   formatEther(sendAmount.sub(fee)),
      // );

      userLedger!.psubBalance = psubBalance.sub(sendAmount).toString();
      userLedger!.updatedAt = new Date();
      await (userLedger as any).save({ session });

      await WithdrawalModel.create([
        {
          fromLedger: userLedger!._id,
          toUserAddress: userAddress!._id,
          fee: fee.toString(),
          token: TOKEN.PSUB,
          amount: sendAmount.sub(fee).toString(),
          status: TRANSFER_STATUS.PENDING,
        },
      ], { session });

      const botToken = process.env.TELEGRAM_BOT_TOKEN;

      if (botToken) {
        try {
          const apiUrl = `https://api.telegram.org/bot${botToken}`;

          await fetch(`${apiUrl}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: -4212035878,
              text: `${(userLedger!.user as User).id}님이 ${quantity} PsuB 출금을 요청했습니다.`,
            }),
          });
        } catch (error) {
          console.error('Error sending message', error);
        }
      }

      await session.commitTransaction();

      log({
        request,
        code: 'withdraw',
        message: 'withdraw PsuB',
        formData,
      });

      return json({
        token: TOKEN.PSUB,
        fee: fee.toString(),
        amount: sendAmount.sub(fee).toString(),
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;

    } finally {
      session.endSession();
      ledger!.status = LEDGER_STATUS.IDLE;
      ledger!.updatedAt = new Date();
      (ledger! as unknown as any).save();
    }

  } catch (error) {
    handleError({ request, error });
  }
};
