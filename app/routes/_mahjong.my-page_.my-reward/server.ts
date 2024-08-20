import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { REWARD_STATUS, SORT } from '~/common/constants';
import { getRandomBoxByUser, toggleAutoBattle } from '~/services/box.server';
import { getCoinPrice } from '~/services/coin.server';
import { swapReward } from '~/services/ledger.server';
import { getRewards } from '~/services/reward.server';
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
  const url = new URL(request.url);
  const tab = url.searchParams.get('tab') || 'REWARDS';

  const user = await getUser(request);
  const userReferral = await getUserReferralFromUser(user!._id!);

  const coinPrice = await getCoinPrice();

  const randomBox = await getRandomBoxByUser(user!._id!);

  const rewards = await getRewards({
    userReferral_id: userReferral!._id,
    status: REWARD_STATUS.OWNED,
    levelSort: SORT.ASC,
  });

  return json({
    rewards: rewards ? rewards : [],
    coinPrice,
    randomBox : randomBox ? randomBox : [],
    tab,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);

  switch (request.method) {
    // * POST: 리워드 교환
    case 'POST': {
      return swapReward(request);
    }
    case 'PUT': {
      return toggleAutoBattle(request, user!._id!);
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
