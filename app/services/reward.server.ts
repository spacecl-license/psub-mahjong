import { json } from '@remix-run/node';
import type { ClientSession, ObjectId, SortOrder } from 'mongoose';

import { GAME_STATUS, REWARD_STATUS, SORT } from '~/common/constants';
import { GameModel, GameV2Model, RewardModel } from '~/models';
import type Game from '~/models/game';
import type GameV2 from '~/models/game-v2';
import type Reward from '~/models/reward';

import dbConnect from './db.server';
import { handleError, log } from './log.server';

// * 리워드 보상 화투 지급
export const addReward = async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  if (!payload.game_id) {
    return json<ErrorData>({
      error: 'game_id must required.',
    }, { status: 400 });
  }

  try {
    const db = await dbConnect();
    const session = await db.startSession();
    const game = await GameModel.findById<Game>(payload.game_id).session(session);

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

    try {
      session.startTransaction();

      // * 리워드 추가
      // * 총 6개 리워드 중 4개 지급하고 2개는 다음 라운드 게임에 자동 사용한걸로 처리
      const [reward] = await RewardModel.create([
        {
          userReferral: game.userReferral._id,
          level: game.level,
          round: game.round,
        },
        {
          userReferral: game.userReferral._id,
          level: game.level,
          round: game.round,
        },
        {
          userReferral: game.userReferral._id,
          level: game.level,
          round: game.round,
        },
        {
          userReferral: game.userReferral._id,
          level: game.level,
          round: game.round,
        },
        {
          userReferral: game.userReferral._id,
          level: game.level,
          round: game.round,
          status: REWARD_STATUS.SWAPPED,
        },
        {
          userReferral: game.userReferral._id,
          level: game.level,
          round: game.round,
          status: REWARD_STATUS.SWAPPED,
        },
      ], { session });

      game.status = GAME_STATUS.REWARDED;
      game.updatedAt = new Date();
      await (game as any).save({ session });

      await session.commitTransaction();

      log({
        request,
        code: 'add-reward',
        message: 'reward added.',
        formData,
      });

      return json({
        reward,
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;

    } finally {
      session.endSession();
    }

  } catch (error) {
    handleError({ request, error });
  }
};

// * 리워드 보상 화투 지급 (game V2)
export const addRewardV2 = async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  if (!payload.game_id) {
    return json<ErrorData>({
      error: 'game_id must required.',
    }, { status: 400 });
  }

  try {
    await dbConnect();
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

    game.status = GAME_STATUS.REWARDED;
    game.updatedAt = new Date();

    // * 리워드 추가
    // * 총 6개 리워드 중 4개 지급하고 2개는 다음 라운드 게임에 자동 사용한걸로 처리
    await RewardModel.create({
      userReferral: game.userReferral._id,
      level: game.level,
      round: game.round,
    });

    await RewardModel.create({
      userReferral: game.userReferral._id,
      level: game.level,
      round: game.round,
    });

    await RewardModel.create({
      userReferral: game.userReferral._id,
      level: game.level,
      round: game.round,
    });

    await RewardModel.create({
      userReferral: game.userReferral._id,
      level: game.level,
      round: game.round,
    });

    await (game as any).save();

    log({
      request,
      code: 'add-reward',
      message: 'reward added.',
      formData,
    });

    return json({});

  } catch (error) {
    handleError({ request, error });
  }
};

// * 리워드 _id 리스트로 조회
export const getUserRewardsFrom_ids = async (
  userReferral_id: ObjectId | string,
  _ids: ObjectId[] | string[],
  status?: REWARD_STATUS,
  session?: ClientSession,
) => {
  await dbConnect();

  const or = _ids.map(_id => ({ _id }));

  const options: any = {
    userReferral: userReferral_id,
    $or: or,
  };

  const sort: { [key: string]: SortOrder } = {
    level: SORT.ASC,
  };

  if (status) options.status = status;
  return session
    ? RewardModel.find<Reward>(options).sort(sort).session(session)
    : RewardModel.find<Reward>(options).sort(sort);
};

// * 리워드 조회
export interface GetRewardsArguments {
  userReferral_id?: ObjectId | string;
  levelSort?: SORT;
  roundSort?: SORT;
  level?: number;
  round?: number;
  status?: REWARD_STATUS;
  or?: any[];
  and?: any[];
  session?: ClientSession;
}

export const getRewards = async ({
  userReferral_id,
  levelSort = SORT.ASC,
  roundSort = SORT.ASC,
  level,
  round,
  status,
  or,
  and,
  session,
}: GetRewardsArguments) => {
  await dbConnect();

  const sort: { [key: string]: SortOrder } = {
    level: levelSort,
    round: roundSort,
    createdAt: SORT.ASC,
  };

  const options: any = {};

  if (userReferral_id) options.userReferral = userReferral_id;
  if (level) options.level = level;
  if (round) options.round = round;
  if (status) options.status = status;
  if (or) options.$or = or;
  if (and) options.$and = and;

  return session
    ? RewardModel.find<Reward>(options).sort(sort).session(session)
    : RewardModel.find<Reward>(options).sort(sort);
};

// * 리워드 보상 화투 지급
export const addOneReward = async (
  userReferral_id: ObjectId | string,
  level: number,
  round: number,
  session?: ClientSession,
) => {
  await dbConnect();

  const reward = session ? await RewardModel.create([
    {
      userReferral: userReferral_id,
      level,
      round,
    },
  ], { session }) : await RewardModel.create({
    userReferral: userReferral_id,
    level,
    round,
  });

  return session ? reward[0] : reward;
};
