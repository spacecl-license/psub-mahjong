import type { ClientSession, ObjectId, SortOrder } from 'mongoose';

import { GAME_STATUS, REFERER_STATUS, SORT } from '~/common/constants';
import { GameV2Model, UserReferralModel } from '~/models';
import type GameV2 from '~/models/game-v2';
import type UserReferral from '~/models/user-referral';
import { aboveReferralIsMaster, isEndedGameV2 } from '~/utils/utils';

import dbConnect from './db.server';
import { getUserReferralFromUser } from './user.server';

// * 게임 조회
export interface GetGamesV2Arguments {
  userReferral_id?: ObjectId | string;
  levelSort?: SORT;
  roundSort?: SORT;
  level?: number;
  round?: number;
  children?: any;
  status?: GAME_STATUS;
  or?: any[];
  and?: any[];
  where?: string;
  session?: ClientSession;
}

export const getGamesV2 = async ({
  userReferral_id,
  levelSort = SORT.ASC,
  roundSort = SORT.ASC,
  level,
  round,
  children,
  status,
  or,
  and,
  where,
  session,
}: GetGamesV2Arguments) => {
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
  if (children) options.children = children;
  if (status) options.status = status;
  if (or) options.$or = or;
  if (and) options.$and = and;
  if (where) options.$where = where;

  return session
    ? GameV2Model.find<GameV2>(options).sort(sort).session(session)
    : GameV2Model.find<GameV2>(options).sort(sort);
};

// * 다음 게임 라운드 확인
export const getNextGameV2Round = async (
  userReferral_id: ObjectId | string,
  level: number,
  session?: ClientSession,
) => {
  await dbConnect();

  const games = await getGamesV2({
    userReferral_id,
    roundSort: SORT.DESC,
    level,
    session,
  });
  return (games && games.length > 0) ? games[0].round + 1 : 1;
};

// * 게임 생성 (재귀)
export const generateGameV2 = async (
  userReferral_id: ObjectId | string,
  level: number,
  session: ClientSession,
) => {
  const userReferral =
    await UserReferralModel.findById<UserReferral>(userReferral_id).session(session);

  if (!userReferral) throw new Error(`can not found userReferral, ${userReferral_id}`);

  const nextGameRound = await getNextGameV2Round(userReferral_id, level, session);
  const aboveIsMaster = aboveReferralIsMaster(userReferral!);
  const ancestorIsMaster = aboveReferralIsMaster(userReferral!.referral! as UserReferral);

  let aboveGame: GameV2 | null = null; // 1대 위 상위 게임
  let ancestorGame: GameV2 | null = null; // 2대 위 조상 게임

  // * 상위 레퍼럴이 마스터 계정이 아닌 경우 상위 게임 확인
  if (!aboveIsMaster) {
    let aboveGames = await getGamesV2({
      userReferral_id: userReferral!.referral!._id as unknown as ObjectId,
      roundSort: SORT.ASC,
      level,
      status: GAME_STATUS.PLAYING,
      where: 'this.children.length < 6',
      session,
    });

    if (aboveGames.length > 0) aboveGame = aboveGames[0];
  }

  // * 조상 레퍼럴이 마스터 계정이 아닌 경우 조상 게임 확인
  if (aboveGame && !ancestorIsMaster) {
    const ancestorGames = await getGamesV2({
      userReferral_id:
        (userReferral!.referral as UserReferral).referral!._id as unknown as ObjectId,
      roundSort: SORT.ASC,
      level,
      status: GAME_STATUS.PLAYING,
      where: 'this.children.length < 6',
      session,
    });

    if (ancestorGames.length > 0) ancestorGame = ancestorGames[0];
  }

  const [gameV2] = await GameV2Model.create([
    {
      userReferral,
      level,
      round: nextGameRound,
    },
  ], { session });

  // * 붙일 상위 타겟 게임이 있는 경우
  if (aboveGame && !aboveIsMaster) {
    aboveGame = await GameV2Model.findById<GameV2>(aboveGame._id).session(session);

    if (aboveGame!.children && aboveGame!.children.length < 6) {
      aboveGame!.children = [...aboveGame!.children, gameV2._id];
      await (aboveGame as any).save({ session });

      // * 상위 게임 완료한 경우
      if (isEndedGameV2(aboveGame!)) {
        aboveGame!.status = GAME_STATUS.ENDED;
        aboveGame!.updatedAt = new Date();
        await (aboveGame as any).save({ session });

        // * 다음 라운드 게임 생성
        await generateGameV2(
          aboveGame!.userReferral._id as ObjectId,
          level,
          session,
        );

        // * 상위의 완료한 게임이 2라운드이고 상위 게임의 레벨이 12가 아닌 경우
        if (aboveGame!.round === 2 && aboveGame!.level !== 12) {
          const nextLevelExist = await GameV2Model.exists({
            userReferral: aboveGame!.userReferral._id,
            level: aboveGame!.level + 1,
          });

          if (!nextLevelExist) {
            // * 레벨업 게임 생성
            await generateGameV2(
              aboveGame!.userReferral._id as ObjectId,
              level + 1,
              session,
            );

            // * 다음 레벨 생성과 함께 리워드 보상 한걸로 처리
            aboveGame!.status = GAME_STATUS.REWARDED;
            aboveGame!.updatedAt = new Date();
            await (aboveGame as any).save({ session });
          }
        }
      }
    }
  }

  // * 조상 게임이 있는 경우
  if (ancestorGame && !ancestorIsMaster) {
    ancestorGame = await GameV2Model.findById<GameV2>(ancestorGame._id).session(session);

    if (ancestorGame!.children && ancestorGame!.children.length < 6) {
      ancestorGame!.children = [...ancestorGame!.children, gameV2._id];
      await (ancestorGame as any).save({ session });

      // * 조상 게임 완료한 경우
      if (isEndedGameV2(ancestorGame!)) {
        ancestorGame!.status = GAME_STATUS.ENDED;
        ancestorGame!.updatedAt = new Date();
        await (ancestorGame as any).save({ session });

        // * 다음 라운드 게임 생성
        await generateGameV2(
          ancestorGame!.userReferral._id as ObjectId,
          level,
          session,
        );

        // * 조상의 완료한 게임이 2라운드이고 조상 게임의 레벨이 12가 아닌 경우
        if (ancestorGame!.round === 2 && ancestorGame!.level !== 12) {
          const nextLevelExist = await GameV2Model.exists({
            userReferral: ancestorGame!.userReferral._id,
            level: ancestorGame!.level + 1,
          });

          if (!nextLevelExist) {
            // * 레벨업 게임 생성
            await generateGameV2(
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
    }
  }

  // * 래퍼럴 코드 잠긴 경우 enabled로 변경
  if (userReferral!.status === REFERER_STATUS.DISABLED) {
    userReferral.status = REFERER_STATUS.ENABLED;
    userReferral.updatedAt = new Date();
    await (userReferral as any).save({ session });
  }

  return gameV2;
};

// * 구매 가능한 레벨 확인
export const getCanBuyGameV2LevelFromUser = async (
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

  const games = await getGamesV2(options);
  let canBuyGameLevel = (games && games.length > 0) ? games[0].level + 1 : 1;
  return canBuyGameLevel;
};
