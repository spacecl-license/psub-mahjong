import { json } from '@remix-run/node';
import type { ClientSession, ObjectId, SortOrder } from 'mongoose';

import {
  GAME_STATUS, INVOICE_STATUS, REFERER_STATUS, SORT,
} from '~/common/constants';
import { GameModel, InvoiceModel, UserReferralModel } from '~/models';
import type Game from '~/models/game';
import type Invoice from '~/models/invoice';
import type UserAddress from '~/models/user-address';
import type UserReferral from '~/models/user-referral';
import { aboveReferralIsMaster, isEndedGame } from '~/utils/utils';

import dbConnect from './db.server';
import { handleError, log } from './log.server';
import { getUserReferralFromUser } from './user.server';

// * 게임 조회
export interface GetGamesArguments {
  userReferral_id?: ObjectId | string;
  levelSort?: SORT;
  roundSort?: SORT;
  level?: number;
  round?: number;
  status?: GAME_STATUS;
  or?: any[];
  and?: any[];
  session?: ClientSession;
}

export const getGames = async ({
  userReferral_id,
  levelSort = SORT.ASC,
  roundSort = SORT.ASC,
  level,
  round,
  status,
  or,
  and,
  session,
}: GetGamesArguments) => {
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
    ? GameModel.find<Game>(options).sort(sort).session(session)
    : GameModel.find<Game>(options).sort(sort);
};

// * 현 가장 높은 게임 레벨 확인
export const getHighestGameLevelFromUser = async (
  user_id: ObjectId | string,
  isEnded?: boolean,
  session?: ClientSession,
) => {
  await dbConnect();
  const userReferral = await getUserReferralFromUser(user_id);

  if (!userReferral) {
    return null;
  }

  const options: any = {
    userReferral_id: userReferral._id!,
    levelSort: SORT.DESC,
    session,
  };

  if (isEnded) {
    options.or = [{ status: GAME_STATUS.ENDED }, { status: GAME_STATUS.REWARDED }];
  }

  const games =
    await getGames(options);
  return (games && games.length > 0) ? games[0].level : 0;
};

// * 구매 가능한 레벨 확인
export const getCanBuyGameLevelFromUser = async (
  user_id: ObjectId | string,
  session?: ClientSession,
) => {
  await dbConnect();
  const userReferral = await getUserReferralFromUser(user_id);

  if (!userReferral) {
    return null;
  }

  const options: any = {
    userReferral_id: userReferral._id!,
    levelSort: SORT.DESC,
    session,
  };

  const games = await getGames(options);
  let canBuyGameLevel = (games && games.length > 0) ? games[0].level + 1 : 1;
  return canBuyGameLevel > 3 ? 3 : canBuyGameLevel;
};

// * 다음 게임 라운드 확인
export const getNextGameRound = async (
  userReferral_id: ObjectId | string,
  level: number,
  session?: ClientSession,
) => {
  await dbConnect();

  const games = await getGames({
    userReferral_id,
    roundSort: SORT.DESC,
    level,
    session,
  });
  return (games && games.length > 0) ? games[0].round + 1 : 1;
};

// * 유저의 모든 게임 조회
export const getAllGamesFromUser = async (
  user_id: ObjectId | string,
  session? : ClientSession,
) => {
  await dbConnect();
  const userReferral = await getUserReferralFromUser(user_id);

  if (!userReferral) {
    return null;
  }

  const games =
    await getGames({
      userReferral_id: userReferral._id!,
      levelSort: SORT.DESC,
      session,
    });
  return games ? games : [];
};

// * 유저의 모든 리워드 받을 수 있는 게임 조회
export const getAllCanRewardGamesFromUser = async (
  user_id: ObjectId | string,
  session? : ClientSession,
) => {
  await dbConnect();
  const userReferral = await getUserReferralFromUser(user_id);

  if (!userReferral) {
    return null;
  }

  const games =
    await getGames({
      userReferral_id: userReferral._id!,
      levelSort: SORT.DESC,
      status: GAME_STATUS.ENDED,
      session,
    });
  return games ? games : [];
};

// * 게임 생성 (재귀)
export const generateGame = async (
  userReferral_id: ObjectId | string,
  level: number,
  session: ClientSession,
) => {
  const userReferral =
    await UserReferralModel.findById<UserReferral>(userReferral_id).session(session);

  const nextGameRound = await getNextGameRound(userReferral_id, level, session);
  const aboveIsMaster = aboveReferralIsMaster(userReferral!);
  const ancestorIsMaster = aboveReferralIsMaster(userReferral!.referral! as UserReferral);

  let aboveGame; // 1대 위 상위 게임 (붙일 타겟 게임)
  let ancestorGame; // 2대 위 조상 게임

  // * 상위 레퍼럴이 마스터 계정이 아닌 경우 상위 게임 확인
  if (!aboveIsMaster) {
    let aboveGames = await getGames({
      userReferral_id: userReferral!.referral!._id as unknown as ObjectId,
      roundSort: SORT.ASC,
      level,
      status: GAME_STATUS.PLAYING,
      or: [{ left: { $exists: false } }, { right: { $exists: false } }],
      session,
    });

    // * 상위 레퍼럴의 게임에 붙일 자리가 없는 경우
    if (!aboveGames || aboveGames.length === 0) {
      aboveGames = await getGames({
        userReferral_id: userReferral!.referral!._id as unknown as ObjectId,
        roundSort: SORT.ASC,
        level,
        status: GAME_STATUS.PLAYING,
        and: [{ left: { $exists: true } }, { right: { $exists: true } }],
        session,
      });

      // * 상위 레퍼럴 게임의 하위 게임 중 붙일 수 있는 곳을 타겟 게임으로
      for (let i in aboveGames) {
        if (
          !(aboveGames[i].left as Game).left ||
          !(aboveGames[i].left as Game).right
        ) {
          aboveGame = aboveGames[i].left as Game;
          break;
        }

        if (
          !(aboveGames[i].right as Game).left ||
          !(aboveGames[i].right as Game).right
        ) {
          aboveGame = aboveGames[i].right as Game;
          break;
        }
      }

    // * 상위 레퍼럴의 게임에 붙일 자리가 있는 경우
    } else {
      aboveGame = aboveGames[0];
    }
  }

  // * 조상 레퍼럴이 마스터 계정이 아닌 경우 조상 게임 확인
  if (aboveGame && !ancestorIsMaster) {
    const ancestorGames = await getGames({
      roundSort: SORT.ASC,
      level,
      status: GAME_STATUS.PLAYING,
      session,
      or: [{ left: aboveGame._id }, { right: aboveGame._id }],
    });
    ancestorGame = ancestorGames[0];
  }

  const [game] = await GameModel.create([
    {
      userReferral,
      level,
      round: nextGameRound,
    },
  ], { session });

  // * 붙일 상위 타겟 게임이 있는 경우
  if (aboveGame && !aboveIsMaster) {
    aboveGame.left
      ? aboveGame.right = game
      : aboveGame.left = game;
    aboveGame.updatedAt = new Date();
    await (aboveGame as any).save({ session });
  }

  // * 조상 게임이 있는 경우
  if (ancestorGame && !ancestorIsMaster) {
    ancestorGame = await GameModel.findById<Game>(ancestorGame._id).session(session);

    // * 조상 게임 완료한 경우
    if (isEndedGame(ancestorGame!)) {
      ancestorGame!.status = GAME_STATUS.ENDED;
      ancestorGame!.updatedAt = new Date();
      await (ancestorGame as any).save({ session });

      // * 다음 라운드 게임 생성
      await generateGame(
        ancestorGame!.userReferral._id as ObjectId,
        level,
        session,
      );

      // * 조상의 완료한 게임이 2라운드이고 조상 게임의 레벨이 12가 아닌 경우
      if (ancestorGame!.round === 2 && ancestorGame!.level !== 12) {
        // * 레벨업 게임 생성
        await generateGame(
          ancestorGame!.userReferral._id as ObjectId,
          level + 1,
          session,
        );

        // * 다음 레벨 생성과 함께 리워드 보상 한걸로 처리
        ancestorGame!.status = GAME_STATUS.REWARDED;
        ancestorGame!.updatedAt = new Date();
        await (ancestorGame as any).save({ session });
      }
    }
  }

  // * 래퍼럴 코드 잠긴 경우 enabled로 변경
  if (userReferral?.status === REFERER_STATUS.DISABLED) {
    userReferral.status = REFERER_STATUS.ENABLED;
    userReferral.updatedAt = new Date();
    await (userReferral as any).save({ session });
  }

  return game;
};

// * 인보이스 결제 내역으로 게임 생성
export const generateGameByInvoice = async (request: Request, invoice_id: ObjectId | string) => {
  try {
    if (!invoice_id) {
      return json<ErrorData>({
        error: 'invoice_id must required.',
      }, { status: 400 });
    }

    const db = await dbConnect();
    const invoice = await InvoiceModel.findById<Invoice>(invoice_id);

    if (!invoice) {
      console.error('invoice is not exist.', invoice_id);
      return json<ErrorData>({
        path: 'invoice',
        error: 'invoice is not exist.',
      }, { status: 403 });
    }

    if (invoice.status !== INVOICE_STATUS.PAID) {
      console.error('can not generate game by this invoice.', invoice.status);
      return json<ErrorData>({
        path: 'invoice',
        error: 'can not generate game by this invoice.',
      }, { status: 403 });
    }

    invoice!.status = INVOICE_STATUS.SUBMITTING;
    invoice!.updatedAt = new Date();
    (invoice! as unknown as any).save();

    const session = await db.startSession();

    const userReferral =
      await UserReferralModel.findOne({ user: (invoice!.userAddress as UserAddress).user._id })
        .session(session);
    let isError = false;

    try {
      session.startTransaction();

      if (invoice.level === 0) {
        const jan = await generateGame(userReferral!._id!, 1, session);
        const feb = await generateGame(userReferral!._id!, 2, session);
        const mar = await generateGame(userReferral!._id!, 3, session);

        await session.commitTransaction();

        log({
          request,
          code: 'generate-game-by-invoice',
          message: 'game generated by invoice.',
        });

        return json({ games: [
          jan,
          feb,
          mar,
        ] });

      } else {
        const game = await generateGame(userReferral!._id!, invoice.level, session);

        await session.commitTransaction();

        log({
          request,
          code: 'generate-game-by-invoice',
          message: 'game generated by invoice.',
        });

        return json({ game });
      }

    } catch (error) {
      await session.abortTransaction();
      isError = true;
      throw error;

    } finally {
      session.endSession();

      isError
        ? invoice!.status = INVOICE_STATUS.ERROR
        : invoice!.status = INVOICE_STATUS.GENERATED;
      invoice!.updatedAt = new Date();
      (invoice! as unknown as any).save();
    }

  } catch (error) {
    handleError({ request, error });
  }
};
