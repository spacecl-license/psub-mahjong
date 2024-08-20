import { json } from '@remix-run/node';
import dayjs from 'dayjs';
import { parseEther } from 'ethers/lib/utils';
import type { ClientSession, ObjectId, SortOrder } from 'mongoose';
import mongoose from 'mongoose';

import { LOTTERY_STATUS, SORT } from '~/common/constants';
import { getTotalBonusRate } from '~/hooks/random-bonus-rate-array';
import { getRandomDelayDays } from '~/hooks/random-delay-days';
import {
  LotteryModel, ReservedTransferModel, UserLedgerModel, UserReferralModel,
} from '~/models';
import type Lottery from '~/models/lottery';
import type UserLedger from '~/models/user-ledger';
import { getNft } from '~/utils/utils';

import dbConnect from './db.server';
import { handleError, log } from './log.server';
import { getUser } from './session.server';

export interface GetLotteryArguments {
  userReferral_id?: ObjectId | string;
  monthSort?: SORT;
  month?: number;
  status?: LOTTERY_STATUS;
  or?: any[];
  and?: any[];
  session?: ClientSession;
}

export const getLotteries = async ({
  userReferral_id,
  monthSort = SORT.ASC,
  month,
  status,
  or,
  and,
  session,
}: GetLotteryArguments) => {
  await dbConnect();

  const sort: { [key: string]: SortOrder } = {
    month: monthSort,
    createdAt: SORT.ASC,
  };

  const options: any = {};

  if (userReferral_id) options.userReferral = userReferral_id;
  if (month) options.month = month;
  if (status) options.status = status;
  if (or) options.$or = or;
  if (and) options.$and = and;

  return session
    ? LotteryModel.find<Lottery>(options).sort(sort).session(session)
    : LotteryModel.find<Lottery>(options).sort(sort);
};

export const openLottery = async (request: Request) => {
  await dbConnect();
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  if (!payload.lottery_ids) {
    return json<ErrorData>({
      error: 'lottery_ids must required.',
    }, { status: 400 });
  }

  const lottery_ids = JSON.parse(payload.lottery_ids as string);

  if (!lottery_ids._id) {
    return json<ErrorData>({
      path: 'lottery_ids',
      error: '_id must required.',
    }, { status: 400 });
  }

  const user = await getUser(request);

  if (!user) {
    throw new Error('User not found');
  }

  const ledger = await UserLedgerModel.findOne<UserLedger>({ user });

  if (!ledger) {
    throw new Error('Ledger not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const lottery = await LotteryModel.findOne<Lottery>({
      _id : lottery_ids._id,
    }).session(session);

    if (!lottery) {
      return json<ErrorData>({
        path: 'lottery_ids',
        error: 'owned lottery not founded.',
      }, { status: 403 });
    }

    // 총 지급 비
    const nft = getNft(lottery.month);
    const price = nft!.price.PsuB;
    const amount = price / 2;

    const prizeRate = getTotalBonusRate();

    const prizeAmount =
    parseEther(
      ((amount * prizeRate).toFixed(2)).toString(),
    ).toString();

    // 예약된 트랜잭션 생성
    const delayDays = getRandomDelayDays();
    const totalDelayDays = delayDays.reduce((a, b) => a + b, 0);
    const transferDate = dayjs().add(totalDelayDays, 'day').toDate();

    const [reservedTransfer] = await ReservedTransferModel.create([
      {
        toLedger: ledger._id,
        amount: prizeAmount,
        month: lottery.month,
        transferTime: transferDate,
      },
    ], { session });

    lottery.prizeRate = prizeRate;
    lottery.prizeAmount = prizeAmount;
    lottery.reservedTransfer = reservedTransfer;
    lottery.delayDays = delayDays;
    lottery.updatedAt = new Date();
    lottery.status = LOTTERY_STATUS.OPENED;

    await (lottery as any).save({ session });

    log({
      request,
      code: 'open-lottery',
      message: 'lottery opened.',
    });

    await session.commitTransaction();
    session.endSession();

    return lottery;
  } catch (error) {
    await session.abortTransaction();
    handleError({ request, error });
  } finally {
    session.endSession();
  }
};

export const getLotteryHistory = async ( userId: ObjectId, page: number = 1) => {
  await dbConnect();

  const PER_PAGE = 10;

  const userReferral = await UserReferralModel.findOne({ user: userId });

  // 유저가 참여한 BoxBetting 이벤트 검색
  const lottery = await LotteryModel.find({
    userReferral,
    benefactor: { $exists: true },
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * PER_PAGE)
    .limit(PER_PAGE);

  return lottery;
};
