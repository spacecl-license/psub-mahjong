import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirectDocument } from '@remix-run/node';

import type { BOX_BETTING_TYPE } from '~/common/constants';
import type User from '~/models/user';
import { getRandomBoxByUser } from '~/services/box.server';
import { createBoxBetting } from '~/services/box-betting.server';
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

  const randomBox = await getRandomBoxByUser(user!._id!);

  return json({
    randomBox,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const user = await getUser(request) as User;
  const level = formData.get('monthly');
  const playerType = formData.get('mode') as BOX_BETTING_TYPE;

  if (!user || !level || !playerType) {
    throw new Error('Invalid request');
  }

  const userId = user._id!;

  // const now = new Date();
  // const chinaHour = (now.getUTCHours() + 8) % 24;

  // if (chinaHour < 14  || chinaHour >= 16){
  //   return json<ErrorData>({
  //     path: 'game-hub',
  //     error: 'Invalid time to play game. Please try again later.',
  //   }, { status: 403 });
  // }

  try {
    if (request.method === 'POST') {

      const boxBetting = await createBoxBetting(request, userId, Number(level), playerType);
      return redirectDocument(`/game-hub/battle-room/${boxBetting._id}`);
    }
  } catch (error : any) {
    console.error(error);
    return json({ error: error.message }, { status: error.status });
  }

};
