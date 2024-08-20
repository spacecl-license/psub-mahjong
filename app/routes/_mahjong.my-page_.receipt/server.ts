import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';

import { UserAddressModel } from '~/models';
import { getReceipts } from '~/services/history.server';
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
  const userAddress = await UserAddressModel.findOne({ user });
  const receipts = await getReceipts(userAddress!._id!);

  return json({
    receipts: receipts ? receipts : [],
  });
};
