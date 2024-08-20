import {
  json, type LoaderFunction, type MetaFunction, redirect,
} from '@remix-run/node';

import { GameV2Model } from '~/models';
import type GameV2 from '~/models/game-v2';
import dbConnect from '~/services/db.server';
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

export const loader: LoaderFunction = async ({ request, params }) => {
  const { game_id } = params;
  const user = await getUser(request);

  if (!game_id || !user/*  || !user.isAdmin */) {
    redirect('/');
  }

  await dbConnect();
  const game = await GameV2Model.findById<GameV2>(game_id);

  if (!game) {
    redirect('/');
  }

  const aboveGame = await GameV2Model.findOne<GameV2>({
    children: { $in: [game!._id] },
  });

  return json({
    game,
    aboveGame,
  });
};
