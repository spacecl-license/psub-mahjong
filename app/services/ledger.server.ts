import { json, redirect } from '@remix-run/node';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import type { ObjectId } from 'mongoose';

import { LEDGER_STATUS, REWARD_STATUS, /* SORT,  */TOKEN } from '~/common/constants';
import {
  ReceiptModel, RewardModel, UserAddressModel, UserLedgerModel, UserReferralModel,
} from '~/models';
import type Reward from '~/models/reward';
import type UserAddress from '~/models/user-address';
import type UserLedger from '~/models/user-ledger';
import type UserReferral from '~/models/user-referral';
import { /* aboveReferralIsMaster,  */getNft } from '~/utils/utils';

import dbConnect from './db.server';
// import { generateGame } from './game.server';
import { generateGameV2, getCanBuyGameV2LevelFromUser, getGamesV2 } from './game-v2.server';
import { handleError, log } from './log.server';
import { getUserRewardsFrom_ids } from './reward.server';
import { mintNft } from './scan.server';
import { getUser } from './session.server';
import { getUserReferralFromUser } from './user.server';

// * 게임 ledger PsuB로 구매
export const purchaseGameV2ByLedger = async (request: Request, nft: Nft) => {
  try {
    const user = await getUser(request);
    const db = await dbConnect();
    const ledger = await UserLedgerModel.findOne<UserLedger>({ user });

    // * ledger가 IDLE이 아닐때 조기 종료
    if (ledger!.status !== LEDGER_STATUS.IDLE) {
      return json<ErrorData>({
        path: 'userLedger',
        error: `target ledger status is ${ledger!.status}. can not use ledger.`,
      }, { status: 403 });
    }

    let userReferral = await UserReferralModel.findOne<UserReferral>({ user });
    let userLedger = await UserLedgerModel.findOne<UserLedger>({ user });
    const games = await getGamesV2({ userReferral_id: userReferral!._id });

    if (nft.month === 0 && games && games.length > 0) {
      return json<ErrorData>({
        path: 'nft',
        error: 'can not purchase this NFT.',
      }, { status: 403 });
    } else {
      const exist = games.find(game => game.level === nft.month);

      if (exist) {
        return json<ErrorData>({
          path: 'nft',
          error: 'can not purchase this NFT.',
        }, { status: 403 });
      }
    }

    const currentLevel = await getCanBuyGameV2LevelFromUser(user!._id!);

    if (currentLevel !== null && currentLevel < nft.month) {
      return json<ErrorData>({
        path: 'nft',
        error: 'need to level up to purchase this NFT.',
      }, { status: 403 });
    }

    // * 상위 추천인이 게임 구매 안했을 경우 게임 구매 방지
    // const aboveIsMaster = aboveReferralIsMaster(userReferral!);

    // if (!aboveIsMaster) {
    // if (nft.month === 0) {
    //   const above1LevelGames = await getGamesV2({
    //     userReferral_id: userReferral!.referral!._id as unknown as ObjectId,
    //     roundSort: SORT.ASC,
    //     level: 1,
    //   });

    //   const above2LevelGames = await getGamesV2({
    //     userReferral_id: userReferral!.referral!._id as unknown as ObjectId,
    //     roundSort: SORT.ASC,
    //     level: 2,
    //   });

    //   const above3LevelGames = await getGamesV2({
    //     userReferral_id: userReferral!.referral!._id as unknown as ObjectId,
    //     roundSort: SORT.ASC,
    //     level: 3,
    //   });

    //   if (
    //     (!above1LevelGames || above1LevelGames.length === 0) ||
    //     (!above2LevelGames || above2LevelGames.length === 0) ||
    //     (!above3LevelGames || above3LevelGames.length === 0)
    //   ) {
    //     return json<ErrorData>({
    //       path: 'nft',
    //       error: 'can not purchase this NFT.',
    //     }, { status: 403 });
    //   }

    // } else {
    // const aboveGames = await getGamesV2({
    //   userReferral_id: userReferral!.referral!._id as unknown as ObjectId,
    //   roundSort: SORT.ASC,
    //   level: nft.month,
    // });

    // if (!aboveGames || aboveGames.length === 0) {
    //   return json<ErrorData>({
    //     path: 'nft',
    //     error: 'can not purchase this NFT.',
    //   }, { status: 403 });
    // }
    // }
    // }

    const psubBalance = BigNumber.from(userLedger!.psubBalance);
    const psubPrice = parseUnits(`${nft.price[TOKEN.PSUB]}`);

    if (psubPrice.gt(psubBalance)) {
      return json<ErrorData>({
        error: 'psub is not enough for purchase.',
      }, { status: 403 });
    }

    // * Ledger SUBMITTING 상태로
    ledger!.status = LEDGER_STATUS.SUBMITTING;
    ledger!.updatedAt = new Date();
    (ledger! as unknown as any).save();

    const session = await db.startSession();
    userReferral = await UserReferralModel.findOne<UserReferral>({ user }).session(session);
    userLedger = await UserLedgerModel.findOne<UserLedger>({ user }).session(session);
    const userAddress = await UserAddressModel.findOne<UserAddress>({ user }).session(session);

    try {
      session.startTransaction();

      // if (nft.month === 0) {
      //   await generateGameV2(userReferral!._id!, 1, session);
      //   await generateGameV2(userReferral!._id!, 2, session);
      //   await generateGameV2(userReferral!._id!, 3, session);
      // } else {
      await generateGameV2(userReferral!._id!, nft.month, session);
      // }

      // * PsuB 가격만큼 차감
      userLedger!.psubBalance = psubBalance.sub(psubPrice).toString();
      userLedger!.updatedAt = new Date();
      await (userLedger as any).save({ session });

      // * Receipt 생성
      await ReceiptModel.create([
        {
          userAddress: userAddress!._id,
          nft: { ...nft },
          token: TOKEN.PSUB,
          paidAmount: psubPrice.toString(),
        },
      ], { session });

      await session.commitTransaction();

      log({
        request,
        code: 'generate-game-v2-by-ledger',
        message: 'game V2 generated use ledger psub points.',
      });

      if (nft.month < 8) {
        mintNft(nft.month, userAddress!.bnbAddress);
      }

      return redirect('/my-page/receipt');

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

// * Ledger 잔액 조회
export const getLedgerBalance = async (user_id: ObjectId | string) => {
  await dbConnect();
  const userLedger = await UserLedgerModel.findOne<UserLedger>({ user: user_id });
  return userLedger ? userLedger.psubBalance : '0';
};

// * 리워드 스왑
export const swapReward = async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  if (!payload.reward_ids) {
    return json<ErrorData>({
      error: 'reward_ids must required.',
    }, { status: 400 });
  }

  const reward_ids = JSON.parse(payload.reward_ids as string) as string[];
  // const bonusRate = parseFloat(payload.bonusRate as string) || '0';

  if (!Array.isArray(reward_ids)) {
    return json<ErrorData>({
      path: 'reward_ids',
      error: 'reward_ids is not array type.',
    }, { status: 400 });
  }

  try {
    const user = await getUser(request);
    const db = await dbConnect();
    const ledger = await UserLedgerModel.findOne<UserLedger>({ user });

    // * ledger가 IDLE이 아닐때 조기 종료
    if (ledger!.status !== LEDGER_STATUS.IDLE) {
      return json<ErrorData>({
        path: 'userLedger',
        error: `target ledger status is ${ledger!.status}. can not use ledger.`,
      }, { status: 403 });
    }

    const session = await db.startSession();
    const userReferral = await getUserReferralFromUser(user!._id!);

    const rewards = await getUserRewardsFrom_ids(
      userReferral!._id!, reward_ids, REWARD_STATUS.OWNED, session,
    );

    if (!rewards || rewards.length === 0) {
      return json<ErrorData>({
        path: 'reward_ids',
        error: 'owned rewards not founded.',
      }, { status: 403 });
    }

    const userLedger = await UserLedgerModel.findOne<UserLedger>({ user }).session(session);
    const psubBalance = BigNumber.from(userLedger!.psubBalance);
    let rewardAmount = BigNumber.from(0);

    // * Ledger SUBMITTING 상태로
    ledger!.status = LEDGER_STATUS.SUBMITTING;
    ledger!.updatedAt = new Date();
    (ledger! as unknown as any).save();

    try {
      session.startTransaction();

      for (let i in rewards) {
        const nft = getNft(rewards[i].level) as Nft;
        let levelReward = BigNumber.from(parseUnits(`${nft.price[TOKEN.PSUB]}`)).div(2);
        // const bonusMultiplier = BigNumber.from(100).add(BigNumber.from(Number(bonusRate) * 100));
        // levelReward = levelReward.mul(bonusMultiplier).div(100);
        rewardAmount = rewardAmount.add(levelReward);
        const reward = await RewardModel.findById<Reward>(rewards[i]._id);
        reward!.status = REWARD_STATUS.SWAPPED;
        reward!.updatedAt = new Date();
        await (reward as any).save({ session });
      }

      // * 리워드 스왑 PsuB 추가
      userLedger!.psubBalance = psubBalance.add(rewardAmount).toString();
      userLedger!.updatedAt = new Date();
      await (userLedger as any).save({ session });

      await session.commitTransaction();

      log({
        request,
        code: 'swap-reward',
        message: 'reward swapped.',
        formData,
      });

      return json({
        userLedger,
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
