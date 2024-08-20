import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';

import { getAllGamesFromUser } from '~/services/game.server';
import { getLedgerBalance } from '~/services/ledger.server';

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
  const { user_id } = params;

  const ledgerBalance = await getLedgerBalance(user_id!);
  const games = await getAllGamesFromUser(user_id!);

  return json({
    ledgerBalance,
    games,
  });
};
