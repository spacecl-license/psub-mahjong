import { json, type LoaderFunction } from '@remix-run/node';

import { SORT } from '~/common/constants';
import { UserReferralModel } from '~/models';
import type UserReferral from '~/models/user-referral';
import { getGamesV2 } from '~/services/game-v2.server';
import { parseSearchParams } from '~/utils/utils.server';

export const loader: LoaderFunction = async ({ request }) => {
  const data = await parseSearchParams(request.url);

  if (!data.userReferral_id) {
    return json<ErrorData>({
      path: 'userReferral_id',
      error: 'userReferral_id must required.',
    }, { status: 400 });
  }

  if (!data.level) {
    return json<ErrorData>({
      path: 'level',
      error: 'level must required.',
    }, { status: 400 });
  }

  const friends = await UserReferralModel.find<UserReferral>({
    referral: data.userReferral_id,
  });

  const promises = friends.map((friend) => {
    return getGamesV2({
      userReferral_id: friend._id,
      roundSort: SORT.DESC,
      level: parseInt(data.level),
    });
  });

  const g = await Promise.all(promises);

  const friendsInfo = g.map((games, i: number) => {
    if (games.length > 0) {
      return {
        id: (games[0].userReferral as UserReferral).user.id,
        level: games[0].level,
        round: games[0].round,
        light: (games[0].round - 1) * 6 + games[0].children.length,
      };
    } else {
      return {
        id: (friends[i] as UserReferral).user.id,
        level: parseInt(data.level),
        round: 0,
        light: 0,
      };
    }
  });

  return json({ friendsInfo });
};
