import dayjs from 'dayjs';
import { parseEther } from 'ethers/lib/utils';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';

import type { BOX_BETTING_TYPE } from '~/common/constants';
import { BOX_BETTING_STATUS, LEVEL_TO_MONTH_MAP, TOKEN } from '~/common/constants';
import { getBonusRate } from '~/hooks/random-bonus-rate';
import { getRandomDelayDays } from '~/hooks/random-delay-days';
import {
  BoxBettingModel, BoxModel, GameV2Model, LotteryModel, PlayerModel, ReservedTransferModel,
  UserLedgerModel,
  UserReferralModel,
} from '~/models';
import type UserReferral from '~/models/user-referral';
import { aboveReferralIsMaster, getNft } from '~/utils/utils';

import { getRandomBoxByUser } from './box.server';
import dbConnect from './db.server';
import { handleError, log } from './log.server';

// 랜덤박스 게임 생성 함수
export const createBoxBetting = async (request: Request, userId: ObjectId, level: number, playerType: BOX_BETTING_TYPE) => {
  const month = LEVEL_TO_MONTH_MAP[level as keyof typeof LEVEL_TO_MONTH_MAP];
  const monthTicket = month + 'Ticket';
  await dbConnect();

  if (!level) {
    throw new Error('Level is required');
  }

  const randomBox = await getRandomBoxByUser(userId);

  if (!randomBox) {
    throw new Error('Random box not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // BoxBetting 인스턴스 생성
    const [boxBetting] = await BoxBettingModel.create([
      {
        type: playerType,
        level,
        rewards : [],
      },
    ], { session });

    // 플레이어 수 계산
    const playerCount = getPlayerCount(playerType);

    // 게임 시작 유저 생성
    const initiatingUser = await PlayerModel.create({
      box: randomBox,
      lastPing : new Date(),
      rank: 0,
      rewardRate: getBonusRate(),
    });

    // 추가 필요한 플레이어 수 계산 (초기 유저 1명 제외)
    const neededPlayers = playerCount - 1;

    // 추가 플레이어 조회
    const additionalPlayers = await BoxModel.aggregate([
      {
        $match: {
          _id: { $ne: randomBox._id },
          isAutoBetting: true,
        },
      },
      {
        $addFields: {
          totalAvailable: {
            $add: [`$${month}`, { $ifNull: [`$${monthTicket}`, 0] }],
          },
        },
      },
      {
        $match: {
          totalAvailable: { $gt: 0 },
        },
      },
      {
        $sample: { size: neededPlayers },
      },
      // {
      //   $limit: neededPlayers,
      // },
    ]);

    if (additionalPlayers.length < neededPlayers) {
      throw new Error('Not enough players');
    }

    const additionalPlayerModels = [];

    // 추가 플레이어 생성
    for (let i = 0; i < additionalPlayers.length; i++) {
      const playerModel = await PlayerModel.create({
        box: additionalPlayers[i]._id,
        lastPing: new Date(),
        rank: 0,
        rewardRate: getBonusRate(),
      });
      additionalPlayerModels.push(playerModel);
    }

    // 이미 선택된 플레이어 포함
    const players = [initiatingUser, ...additionalPlayerModels];

    const ranks = [];

    const rankLevel = [
      4,
      3,
      2,
      1,
      0,
    ];

    // 첫 번째 플레이어 랭크 결정
    const firstPlaceRankIndex = Math.floor(Math.random() * (rankLevel.length - 1));
    const firstPlaceIndex = Math.floor(Math.random() * playerCount);
    ranks[firstPlaceIndex] = rankLevel[firstPlaceRankIndex];

    // 나머지 플레이어 랭크 결정
    const lowerRanks = rankLevel.slice(firstPlaceRankIndex + 1);
    lowerRanks.sort(() => Math.random() - 0.5);

    let rankIndex = 0;

    for (let i = 0; i < playerCount; i++) {
      if (i !== firstPlaceIndex) {
        if (rankIndex >= lowerRanks.length) rankIndex = 0;
        ranks[i] = lowerRanks[rankIndex++];
      }
    }

    for (let i = 0; i < playerCount; i++) {
      players[i].rank = ranks[i];
    }

    boxBetting.players = players;

    boxBetting.matchedAt = new Date();
    boxBetting.status = BOX_BETTING_STATUS.WAITING;

    await boxBetting.save({ session });

    const highestRankedPlayer = players.reduce((highest: { rank: number; }, player: { rank: number; }) => {
      return (highest.rank > player.rank) ? highest : player;
    });

    boxBetting.winnerPlayer = highestRankedPlayer;

    const highestRankedPlayerBox = await BoxModel.findOne({ _id: highestRankedPlayer.box._id });

    const highestRankedPlayerLedgerId =
     await UserLedgerModel.findOne({ user: highestRankedPlayerBox.userReferral.user._id });

    // 이긴 플레이어의 Box 처리
    if (highestRankedPlayerBox) {
      const monthField = month;
      const monthTicketField = month + 'Ticket';

      if (highestRankedPlayerBox[monthTicketField] > 0) {
        highestRankedPlayerBox[monthTicketField] -= 1;
      } else if (highestRankedPlayerBox[monthField] > 0) {
        highestRankedPlayerBox[monthField] -= 1;
      }

      highestRankedPlayerBox.updatedAt = new Date();
      await highestRankedPlayerBox.save({ session });
    }

    // 진 플레이어의 Box 처리
    for (let player of players) {
      if (player !== highestRankedPlayer && player.box._id) {
        const playerBox = await BoxModel.findOne({ _id: player.box._id });

        if (playerBox) {
          const monthField = month;
          const monthTicketField = month + 'Ticket';

          if (playerBox[monthTicketField] > 0) {
          } else if (playerBox[monthField] > 0) {
            playerBox[monthField] -= 1;
            playerBox[monthTicketField] += 1;
          }

          playerBox.updatedAt = new Date();

          await playerBox.save({ session });
        }
      }
    }

    const nft = getNft(level);
    const price = nft!.price.PsuB;

    const amount = price / 2;

    // 상금 계산
    const rewardRates = players.map(player => player.rewardRate);
    const totalRewardRate = rewardRates.reduce((a, b) => a + b, 0);

    const prizeAmount =
     parseEther(
       ((amount * playerCount + amount * Number(totalRewardRate.toFixed(2))) * 0.8).toFixed(2),
     ).toString();

    // 예약된 트랜잭션 생성
    const delayDays = getRandomDelayDays();
    const totalDelayDays = delayDays.reduce((a, b) => a + b, 0);
    const transferDate = dayjs().add(totalDelayDays, 'day').toDate();

    const [reservedTransfer] = await ReservedTransferModel.create([
      {
        toLedger: highestRankedPlayerLedgerId._id,
        amount: prizeAmount,
        month: level,
        transferTime: transferDate,
      },
    ], { session });

    await assignLotteriesToReferrals(players, session, level);

    boxBetting.reservedTransfer = reservedTransfer;
    boxBetting.prizeAmount = prizeAmount;
    boxBetting.delayDays = delayDays;
    boxBetting.month = level;

    boxBetting.endedAt = new Date();
    boxBetting.status = BOX_BETTING_STATUS.ENDED;

    await boxBetting.save({ session });

    log({
      request,
      code: 'create-box-betting',
      message: 'Box betting created',
    });

    await session.commitTransaction();
    session.endSession();
    return boxBetting;
  } catch (error) {
    await session.abortTransaction();
    handleError({ request, error });
    throw error;
  } finally {
    session.endSession();
  }
};

// 박스 게임 결과 조회 함수
export const getBoxBetting = async ( id: string) => {
  await dbConnect();

  const boxBetting = await BoxBettingModel.findOne({ _id: id });

  if (!boxBetting) {
    throw new Error('Box betting not found');
  }

  if ( boxBetting.status !== BOX_BETTING_STATUS.ENDED) {
    throw new Error('Box betting is not waiting');
  }

  return boxBetting;
};

// 박스 게임 결과 안에 포함된 플레이어 isSeenCount 업데이트 함수
export const updatePlayerSeenCount = async (boxId: string) => {
  await dbConnect();
  await BoxBettingModel.updateOne({ _id: boxId }, { 'players.$[].isSeenCount': true });

  return true;
};

// 플레이어 수를 결정하는 함수
const getPlayerCount = (type: BOX_BETTING_TYPE): number => {
  switch (type) {
    case '2p': return 2;
    case '3p': return 3;
    case '5p': return 5;
    default: return 0;
  }
};

const PER_PAGE = 10;

export const getBoxBettingHistory = async ( userId: ObjectId, page: number = 1) => {
  await dbConnect();

  const randomBox = await getRandomBoxByUser(userId);

  // 유저가 참여한 BoxBetting 이벤트 검색
  const history = await BoxBettingModel.find({
    'players': {
      $elemMatch: {
        'box': randomBox._id,
      },
    },
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * PER_PAGE)
    .limit(PER_PAGE);

  return history;
};

// 복권 생성 함수
const createLotteryForReferral = async (
  userReferral : UserReferral,
  session: mongoose.mongo.ClientSession | null,
  level : number,
  benefactor: UserReferral,
) => {

  if (!userReferral) return null;

  // 복권 생성
  const [lottery] = await LotteryModel.create([
    {
      userReferral : userReferral._id,
      month : level,
      token: TOKEN.PSUB,
      benefactor : benefactor._id,
    },
  ], { session });

  return lottery;
};

// 플레이어 상위 추천인에게 복권 부여 로직
const assignLotteriesToReferrals = async (players: any, session: mongoose.mongo.ClientSession | null, level : number) => {
  for (const player of players) {
    const playerBox = await BoxModel.findOne({ _id: player.box });
    if (!playerBox || !playerBox.userReferral) continue;

    const aboveIsMaster =
      aboveReferralIsMaster(playerBox.userReferral!);

    const ancestorIsMaster =
      aboveReferralIsMaster(playerBox.userReferral!.referral! as UserReferral);

    const aboveReferral =
      await UserReferralModel.findOne({ user: playerBox.userReferral!.referral!.user });

    // 상위 추천인
    if (!aboveIsMaster) {
      await createLotteryForReferral(aboveReferral, session, level, playerBox.userReferral );
    }

    const ancestorLevel7 =
    await GameV2Model.findOne({ userReferral: aboveReferral.referral._id, level: 7 });

    // 조상 추천인
    if (!ancestorIsMaster && ancestorLevel7) {
      const ancestorReferral =
        await UserReferralModel.findOne({ user: aboveReferral.referral.user });

      await createLotteryForReferral(ancestorReferral, session, level, playerBox.userReferral );
    }
  }
};
