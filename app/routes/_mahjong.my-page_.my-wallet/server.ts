import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';

import { UserAddressModel, UserTxHashModel } from '~/models';
import { getCoinPrice } from '~/services/coin.server';
import dbConnect from '~/services/db.server';
import { getLedgerBalance } from '~/services/ledger.server';
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
  await dbConnect();
  const user = await getUser(request);
  const userAddress = await UserAddressModel.findOne({ user });
  const userTransactionPassword = await UserTxHashModel.findOne({ user });

  const psubBalance = await getLedgerBalance(user!._id!);

  const coinPrice = await getCoinPrice();

  return json({
    psubBalance,
    coinPrice,
    userAddress,
    userTransactionPassword,
  });
};
