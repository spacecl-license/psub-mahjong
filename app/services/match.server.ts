import { json } from '@remix-run/node';
import dayjs from 'dayjs';
import type { ObjectId } from 'mongoose';

import { BOX_BETTING_STATUS, type BOX_BETTING_TYPE } from '~/common/constants';
import { BoxBettingModel, BoxModel } from '~/models';
import type Box from '~/models/box';
import type BoxBetting from '~/models/box-betting';
import type { Player } from '~/models/box-betting';

import dbConnect from './db.server';
import { getUserReferralFromUser } from './user.server';

// * 베팅 매칭
export const matchBoxBetting = async (
  user_id: ObjectId | string,
  month: Month,
  type: BOX_BETTING_TYPE,
) => {
  await dbConnect();
  const maxPlayerCount = parseInt(type.substring(0, 1));
  const where = `this.players.length < ${maxPlayerCount}`;

  const userReferral = await getUserReferralFromUser(user_id);
  const box = await BoxModel.findOne<Box>({ userReferral });

  const canJoinBettings = await BoxBettingModel.find<BoxBetting>({
    type,
    month,
    status: BOX_BETTING_STATUS.SEARCHING,
    where,
  });

  // * 매칭할 게임이 없는 경우 신규 베팅 생성하여 조기 리턴
  if (canJoinBettings.length === 0) {
    const boxBetting = await BoxModel.create({
      type,
      month,
      players: [
        {
          box,
          lastPing: new Date(),
          isSeenCount: false,
          rank: -1, // 랭크 지정 안됨
        } as Player,
      ],
    });

    return json({
      boxBetting,
    });
  }

  // * lastPing이 갱신 안된 기존 플레이어들 정리
  const players: Player[] = [];
  const currentDate = new Date();

  for (const player of canJoinBettings[0].players) {
    const isAlive = dayjs(currentDate).subtract(5, 'seconds').isAfter(player.lastPing);

    if (isAlive) {
      players.push(player);
    }
  }

  // * 플레이어 참가
  canJoinBettings[0].players = [
    ...players,
    {
      box,
      lastPing: new Date(),
      isSeenCount: false,
      rank: -1, // 랭크 지정 안됨
    } as Player,
  ];

  await (canJoinBettings[0] as any).save();

  if (canJoinBettings[0].players.length === maxPlayerCount) {
    // TODO: 게임 진행 처리
  } else {
    return json({
      boxBetting: canJoinBettings[0],
    });
  }
};

// * 플레이어 핑 갱신
export const refreshLastPing = async (
  user_id: ObjectId | string,
  boxBetting_id: ObjectId | string,
) => {
  await dbConnect();
  const userReferral = await getUserReferralFromUser(user_id);
  const box = await BoxModel.findOne<Box>({ userReferral });
  const boxBetting = await BoxBettingModel.findOne<BoxBetting>({ _id: boxBetting_id });

  if (!box || !boxBetting) {
    return json<ErrorData>({
      error: 'can not refresh ping',
    });
  }

  const meIndex = boxBetting.players.findIndex(p => p.box._id === box._id);

  if (meIndex < 0) {
    return json<ErrorData>({
      error: 'can not refresh ping',
    });
  }

  // * lastPing 갱신
  boxBetting.players[meIndex].lastPing = new Date();
  await (boxBetting as any).save();

  return json({ boxBetting });
};
