import {
  json, type LoaderFunction, type MetaFunction, redirect,
} from '@remix-run/node';

import { GameModel } from '~/models';
import type Game from '~/models/game';
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
  const game = await GameModel.findById<Game>(game_id);

  const aboveGame = await GameModel.findOne<Game>({
    $or: [{ left: game_id }, { right: game_id }],
  });

  if (!game) {
    redirect('/');
  }

  return json({
    game,
    aboveGame,
  });
};
