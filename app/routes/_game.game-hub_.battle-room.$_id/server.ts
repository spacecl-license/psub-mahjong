import {
  json, type LoaderFunction, type MetaFunction, redirect,
} from '@remix-run/node';
import type { Schema } from 'mongoose';

import { BoxModel, PlayerModel } from '~/models';
import { getRandomBoxByUser } from '~/services/box.server';
import { getBoxBetting } from '~/services/box-betting.server';
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

const getPlayer = async (playerId: Schema.Types.ObjectId) => {
  await dbConnect();

  const player = await PlayerModel.findOne({ _id : playerId });

  const boxId = player?.box._id;
  return BoxModel.findOne({ _id: boxId });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);

  const { _id } = params;

  if (!_id) {
    return redirect('/game-hub');
  }

  const randomBox = await getRandomBoxByUser(user!._id!);

  const randomBoxGame = await getBoxBetting(_id);

  let isSeen;

  isSeen = randomBoxGame.players[0].isSeenCount;

  const player = randomBoxGame.players.map(async (player:  { _id: Schema.Types.ObjectId; }) => {
    return getPlayer(player._id);
  });

  const playersBox = await Promise.all(player);

  return json({
    randomBoxGame,
    randomBox,
    playersBox,
    isSeen,
  });
};
