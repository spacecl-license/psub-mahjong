import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { LOTTERY_STATUS, SORT } from '~/common/constants';
import { getLotteries, openLottery } from '~/services/lottery.server';
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

  const lotteries = await getLotteries({
    userReferral_id: userReferral!._id,
    status: LOTTERY_STATUS.UNOPENED,
    monthSort: SORT.ASC,
  });

  return json({
    lotteries: lotteries ? lotteries : [],
  });
};

export const action: ActionFunction = async ({ request }) => {

  switch (request.method) {
    // * POST: 리워드 교환
    case 'POST': {
      return openLottery(request);
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
