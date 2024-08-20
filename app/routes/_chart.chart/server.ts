import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirectDocument } from '@remix-run/node';

import { getCoinPrice } from '~/services/coin.server';
import { getUser } from '~/services/session.server';
import { findSubReferrals, findUserRank } from '~/services/user-rank.server';

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
  const coinPrice = await getCoinPrice();

  if (!user) {
    return redirectDocument('/login');
  }

  const userRank = await findUserRank(user._id!);

  return json({
    userRank,
    coinPrice,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userId = formData.get('userId') as any;
  const level = formData.get('level');

  if (!userId || !level) {
    throw new Error('Invalid request');
  }

  try {
    if (request.method === 'POST') {
      const children = await findSubReferrals( userId, Number(level));
      return json({ children });
    }
  } catch (error : any) {
    console.error(error);
    return json({ error: error.message }, { status: error.status });
  }

};
