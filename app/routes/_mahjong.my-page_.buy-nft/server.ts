import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';

import { getCanBuyGameV2LevelFromUser } from '~/services/game-v2.server';
import { getUser } from '~/services/session.server';

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
  const canBuyGameLevel = await getCanBuyGameV2LevelFromUser(user!._id!);

  return json({
    user,
    canBuyGameLevel,
  });
};
