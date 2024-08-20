import { json } from '@remix-run/node';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';

import {
  BOX_STATUS, GAME_STATUS, LEVEL_TO_MONTH_MAP, TOKEN,
} from '~/common/constants';
import {
  BoxModel, BoxReceiptModel, GameV2Model, RewardModel, TransferModel, UserLedgerModel, UserModel, UserReferralModel,
} from '~/models';
import type GameV2 from '~/models/game-v2';
import type UserLedger from '~/models/user-ledger';
import type UserReferral from '~/models/user-referral';
import { aboveReferralIsMaster } from '~/utils/utils';

import dbConnect from './db.server';
import { handleError, log } from './log.server';
import { getUser } from './session.server';

// * 리워드 보상 화투 지급 (game V2)
export const addRandomBoxV2 = async (request: Request, userId : ObjectId) => {
  await dbConnect();
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  if (!payload.game_id) {
    return json<ErrorData>({
      error: 'game_id must required.',
    }, { status: 400 });
  }

  const game = await GameV2Model.findById<GameV2>(payload.game_id);

  if (!game) {
    return json<ErrorData>({
      path: 'game_id',
      error: 'game not founded.',
    }, { status: 403 });
  }

  if (game.status !== GAME_STATUS.ENDED) {
    return json<ErrorData>({
      path: 'game',
      error: 'can not reward about this game.',
    }, { status: 403 });
  }

  // 사용자 조회
  let randomBox = await getRandomBoxByUser(userId);

  if (!randomBox) {
    randomBox = await BoxModel.create({
      userReferral: game.userReferral,
      status : BOX_STATUS.IDLE,
    });
  }

  const month = LEVEL_TO_MONTH_MAP[game.level as keyof typeof LEVEL_TO_MONTH_MAP];

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    randomBox.status = BOX_STATUS.SUBMITTING;

    randomBox.$inc([month], 4);
    randomBox.updatedAt = new Date();

    randomBox.status = BOX_STATUS.IDLE;

    game.status = GAME_STATUS.REWARDED;
    game.updatedAt = new Date();

    await randomBox.save({ session });
    await (game as any).save({ session });

    // 커밋 및 세션 종료
    await session.commitTransaction();

    log({
      request,
      code: 'add-random-box',
      message: 'random-box added.',
      formData,
    });

    return json({});
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
    randomBox.status = BOX_STATUS.IDLE;
    randomBox.updatedAt = new Date();
  }

};

// * 사용자 랜덤 박스 조회
export const getRandomBoxByUser = async ( userId : ObjectId) => {
  await dbConnect();
  // 사용자 조회
  const user = await UserModel.findById(userId);

  // 사용자 추천 정보 조회
  const userReferral = await UserReferralModel.findOne({ user });

  if (!userReferral) {
    return json<ErrorData>({
      path: 'userReferral',
      error: 'user referral not founded.',
    }, { status: 403 });
  }

  let randomBox = await BoxModel.findOne({ userReferral });

  if (!randomBox) {
    randomBox = await BoxModel.create({
      userReferral,
      status : BOX_STATUS.IDLE,
    });
  }

  return randomBox;
};

// * 사용자 자동 게임참여 여부 토글
export const toggleAutoBattle = async (request :Request, userId : ObjectId) => {
  await dbConnect();

  let randomBox = await getRandomBoxByUser(userId);

  const userReferral = await UserReferralModel.findOne({ user: userId });

  if (!randomBox) {
    randomBox = await BoxModel.create({
      userReferral,
      status : BOX_STATUS.IDLE,
    });
  }

  try {
    randomBox.isAutoBetting = !randomBox.isAutoBetting;
    await randomBox.save();

    log({
      request,
      code: 'toggle-auto-battle',
      message: 'auto-battle toggled.',
    });

    return randomBox;
  } catch (error) {
    handleError({ request, error });
  }
};

// 랜덤박스 오픈
export const openRandomBox = async (request : Request, userId : ObjectId, level : number, amount : number ) => {
  await dbConnect();

  const randomBox = await getRandomBoxByUser(userId);

  if (!randomBox) {
    return json<ErrorData>({
      path: 'randomBox',
      error: 'random box not founded.',
    }, { status: 403 });
  }

  if (randomBox.status !== BOX_STATUS.IDLE) {
    return json<ErrorData>({
      path: 'randomBox',
      error: 'random box is not idle.',
    }, { status: 403 });
  }

  const month = LEVEL_TO_MONTH_MAP[level as keyof typeof LEVEL_TO_MONTH_MAP];

  // 사용자 조회
  const user = await UserModel.findById(userId);

  // 사용자 추천 정보 조회
  const userReferral = await UserReferralModel.findOne({ user });

  if (!userReferral) {
    return json<ErrorData>({
      path: 'userReferral',
      error: 'user referral not founded.',
    }, { status: 403 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    randomBox.status = BOX_STATUS.SUBMITTING;

    randomBox.$inc([month], -amount);
    randomBox.updatedAt = new Date();

    for (let i = 0; i < amount; i++) {
      await RewardModel.create({
        userReferral : userReferral._id,
        level,
        round: 1,
        box: randomBox,
      });
    }

    randomBox.status = BOX_STATUS.IDLE;

    await randomBox.save({ session });

    log({
      request,
      code: 'add-random-box',
      message: 'random-box added.',
    });

    // 커밋 및 세션 종료
    await session.commitTransaction();
    session.endSession();

    return json({});
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
    randomBox.status = BOX_STATUS.IDLE;
    randomBox.updatedAt = new Date();
  }
};

// 랜덤박스 구매
export const buyRandomBox = async (request: Request, nft: Nft) => {
  await dbConnect();
  // 사용자 조회
  const user = await getUser(request);

  if (!user) {
    return json<ErrorData>({
      path: 'user',
      error: 'user not founded.',
    }, { status: 403 });
  }

  const randomBox = await getRandomBoxByUser(user._id as ObjectId);
  const today = new Date().setHours(0, 0, 0, 0);
  const lastPurchaseDate = new Date(randomBox.lastPurchasedAt!).setHours(0, 0, 0, 0);

  if (!lastPurchaseDate){
    randomBox.lastPurchasedAt = new Date();
  }

  if (!randomBox) {
    return json<ErrorData>({
      path: 'randomBox',
      error: 'random box not founded.',
    }, { status: 403 });
  }

  if (randomBox.status !== BOX_STATUS.IDLE) {
    return json<ErrorData>({
      path: 'randomBox',
      error: 'random box is not idle.',
    }, { status: 403 });
  }

  let todayMyReferralsCount = 0;

  // 당일 내가 추천인한 사람 조회
  todayMyReferralsCount = await getMyReferrals(request) as number;

  if (todayMyReferralsCount > 2){
    todayMyReferralsCount = 2;
  }

  if (lastPurchaseDate < today) {
    randomBox.dailyPurchaseCount = 0;
    randomBox.lastPurchasedAt = new Date();
  }

  if (randomBox.dailyPurchaseCount >= 2 + (todayMyReferralsCount * 2) && todayMyReferralsCount < 2) {
    return json<ErrorData>({
      path: 'randomBox',
      error: 'You\'ve reached your daily purchase limit.',
    }, { status: 403 });
  }

  const month = LEVEL_TO_MONTH_MAP[4 as keyof typeof LEVEL_TO_MONTH_MAP];

  // 사용자 추천 정보 조회
  let userReferral = await UserReferralModel.findOne({ user });
  const aboveReferral = await UserReferralModel.findOne({ user: userReferral!.referral!.user });

  const aboveIsMaster = aboveReferralIsMaster(userReferral!);
  const ancestorIsMaster = aboveReferralIsMaster(userReferral!.referral! as UserReferral);

  if (!userReferral) {
    return json<ErrorData>({
      path: 'userReferral',
      error: 'user referral not founded.',
    }, { status: 403 });
  }

  // 사용자 레저 조회
  let userLedger = await UserLedgerModel.findOne({ user });

  if (!userLedger) {
    return json<ErrorData>({
      path: 'userLedger',
      error: 'user ledger not founded.',
    }, { status: 403 });
  }

  const psubBalance = BigNumber.from(userLedger!.psubBalance);
  const psubPrice = parseUnits(`${nft.price[TOKEN.PSUB]}`);

  if (psubPrice.gt(psubBalance)) {
    return json<ErrorData>({
      path: 'psubBalance',
      error: 'psub is not enough for purchase.',
    }, { status: 403 });
  }

  const session = await mongoose.startSession();
  userReferral = await UserReferralModel.findOne<UserReferral>({ user }).session(session);
  userLedger = await UserLedgerModel.findOne<UserLedger>({ user }).session(session);
  session.startTransaction();

  try {
    randomBox.status = BOX_STATUS.SUBMITTING;
    await randomBox.save();
    randomBox.$inc([month], 1);
    randomBox.updatedAt = new Date();

    randomBox.status = BOX_STATUS.IDLE;
    randomBox.dailyPurchaseCount = randomBox.dailyPurchaseCount! + 1;

    userLedger!.psubBalance = psubBalance.sub(psubPrice).toString();
    userLedger!.updatedAt = new Date();
    await (userLedger as any).save({ session });

    if (!aboveIsMaster){
      const aboveUserLedger =
        await UserLedgerModel.findOne({ user: aboveReferral.user }).session(session);

      const [transfer] = await TransferModel.create([
        {
          toLedger: aboveUserLedger,
          fee: '0',
          token: TOKEN.PSUB,
          amount : psubPrice.div(100).mul(3).toString(),
          status: 'pending',
          createdAt: new Date(),
          userReferral,
        },
      ], { session });

      aboveUserLedger!.psubBalance =
        BigNumber.from(aboveUserLedger!.psubBalance).add(psubPrice.div(100).mul(3)).toString();
      aboveUserLedger!.updatedAt = new Date();
      await (aboveUserLedger as any).save({ session });
      transfer.status = 'confirmed';

      await transfer.save({ session });
    }

    const ancestorLevel7 =
      await GameV2Model.findOne({ userReferral: aboveReferral.referral._id, level: 7 });

    if (!ancestorIsMaster && ancestorLevel7){
      const ancestorUserLedger =
      await UserLedgerModel.findOne({ user: aboveReferral.referral!.user }).session(session);

      const [transfer] = await TransferModel.create([
        {
          toLedger: ancestorUserLedger,
          fee: '0',
          token: TOKEN.PSUB,
          amount : psubPrice.div(100).mul(5).toString(),
          status: 'pending',
          createdAt: new Date(),
          userReferral,
        },
      ], { session });

      ancestorUserLedger!.psubBalance =
       BigNumber.from(ancestorUserLedger!.psubBalance).add(psubPrice.div(100).mul(5)).toString();
      ancestorUserLedger!.updatedAt = new Date();
      await (ancestorUserLedger as any).save({ session });

      transfer.status = 'confirmed';
      await transfer.save({ session });
    }

    await BoxReceiptModel.create([
      {
        userLedger: userLedger!._id,
        month: 4,
        token: TOKEN.PSUB,
        amount: psubPrice.toString(),
      },
    ], { session });

    await randomBox.save({ session });

    log({
      request,
      code: 'add-random-box',
      message: 'random-box added.',
    });

    // 커밋 및 세션 종료
    await session.commitTransaction();
    session.endSession();

    return randomBox;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
    randomBox.status = BOX_STATUS.IDLE;
    randomBox.updatedAt = new Date();
  }
};

// 당일 내가 추천인한 사람 조회
export const getMyReferrals = async (request : Request) => {
  await dbConnect();
  const user = await getUser(request);

  if (!user) {
    return json<ErrorData>({
      path: 'user',
      error: 'User not found.',
    }, { status: 403 });
  }

  const userReferral = await UserReferralModel.findOne({ user });

  if (!userReferral) {
    return json<ErrorData>({
      path: 'userReferral',
      error: 'User referral not found.',
    }, { status: 403 });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const referrals = await UserReferralModel.find({
    referral: userReferral._id,
    createdAt: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  });

  return referrals.length;
};
