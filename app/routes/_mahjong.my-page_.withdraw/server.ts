import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { UserAddressModel, UserTxHashModel } from '~/models';
import { getCoinPrice } from '~/services/coin.server';
import dbConnect from '~/services/db.server';
import { getLedgerBalance } from '~/services/ledger.server';
import { getUser } from '~/services/session.server';
import { withdraw } from '~/services/withdraw.server';
import { handleNotAllowedMethod } from '~/utils/utils.server';

export const config = {
  maxDuration: 270,
};

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
    userAddress,
    psubBalance,
    coinPrice,
    userTransactionPassword,
  });
};

export const action: ActionFunction = async ({ request }) => {
  // TODO: 열어줄때 아래 코드 제거
  // return handleNotAllowedMethod();

  switch (request.method) {
    // * POST: 인출 신청
    case 'POST': {
      return withdraw(request);
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
