import { json } from '@remix-run/node';

import { GameV2Model, UserReferralModel } from '~/models';

import dbConnect from './db.server';

// 특정 유저의 게임 상태를 조회하는 함수
export const getUserGameStatus = async (userReferralId: string) => {
  await dbConnect();

  try {
    const userReferral = await UserReferralModel.findById(userReferralId);

    if (!userReferral) {
      console.error('UserReferral not found');
      return json({ error: 'UserReferral not found' }, { status: 404 });
    }

    const gameStatus = await GameV2Model.aggregate([
      {
        $match: {
          userReferral: userReferral._id,
        },
      },
      {
        $group: {
          _id: '$level',
          maxRound: { $max: '$round' },
          totalChildren: { $sum: { $size: '$children' } },
          lastChild: { $last: '$children' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return  gameStatus;
  } catch (error) {
    console.error('Error fetching user game status', error);
    return json({ error: 'An error occurred while fetching the user game status.' }, { status: 500 });
  }
};
