import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';

import { TransferModel, WithdrawalModel } from '~/models';
import dbConnect from '~/services/db.server';
import { getUser } from '~/services/session.server';
import { getUserLedgerFromUser } from '~/services/user.server';

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
  const userLedger = await getUserLedgerFromUser(user!._id!);

  const transfers = await TransferModel.find({
    $or: [{ fromLedger: userLedger!._id! }, { toLedger: userLedger!._id! }],
    status: 'confirmed',
  }).sort({ createdAt: -1 });

  const withdraws = await WithdrawalModel.find({
    $or: [{ fromLedger: userLedger!._id! }, { toLedger: userLedger!._id! }],
    status: 'confirmed',
  }).sort({ createdAt: -1 });

  return json({
    transfers,
    withdraws,
  });
};
