import type {  ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { getRandomBoxByUser } from '~/services/box.server';
import { getBoxBettingHistory } from '~/services/box-betting.server';
import { getLotteryHistory } from '~/services/lottery.server';
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

  const history = await getBoxBettingHistory(user!._id!, 1);

  const lottery = await getLotteryHistory(user!._id!, 1);

  const randomBox = await getRandomBoxByUser(user!._id!);

  return json({
    history,
    randomBox,
    lottery,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);

  const formData = await request.formData();
  const page = parseInt(formData.get('page') as string);
  const type = formData.get('type') as string;

  if (type === 'history') {
    const history = await getBoxBettingHistory(user!._id!, page);
    return json({ history });
  } else if (type === 'lottery') {
    const lottery = await getLotteryHistory(user!._id!, page);
    return json({ lottery });
  }
};
