import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { GAME_STATUS } from '~/common/constants';
import { addRandomBoxV2 } from '~/services/box.server';
import { getCoinPrice } from '~/services/coin.server';
// import { getGames } from '~/services/game.server';
import { getGamesV2 } from '~/services/game-v2.server';
import { getUser } from '~/services/session.server';
import { getUserReferralFromUser } from '~/services/user.server';
import { handleNotAllowedMethod } from '~/utils/utils.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'PsuB NFT World' },
    {
      property: 'og:title',
      content: 'PsuB NFT World',
    },
    { name: 'description', content: 'Welcome to PsuB NFT World!' },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const userReferral = await getUserReferralFromUser(user!._id!);

  const coinPrice = await getCoinPrice();

  // * 기존 룰 게임 조회
  // const [ongoingGames, rewardedGames] = await Promise.all([
  //   getGames({
  //     userReferral_id: userReferral!._id!,
  //     or: [{ status: GAME_STATUS.PLAYING }, { status: GAME_STATUS.ENDED }],
  //   }),
  //   getGames({
  //     userReferral_id: userReferral!._id!,
  //     status: GAME_STATUS.REWARDED,
  //   }),
  // ]);

  // * 신규 룰 게임 조회
  const [ongoingGames, rewardedGames] = await Promise.all([
    getGamesV2({
      userReferral_id: userReferral!._id!,
      or: [{ status: GAME_STATUS.PLAYING }, { status: GAME_STATUS.ENDED }],
    }),
    getGamesV2({
      userReferral_id: userReferral!._id!,
      status: GAME_STATUS.REWARDED,
    }),
  ]);

  return json({
    ongoingGames: ongoingGames ? ongoingGames : [],
    rewardedGames: rewardedGames ? rewardedGames : [],
    coinPrice,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  const userID = user!._id!;

  switch (request.method) {
    // * POST: 리워드 받기
    case 'POST': {
      return addRandomBoxV2(request, userID);
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
