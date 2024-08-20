import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';

import { UserAddressModel, UserTxHashModel } from '~/models';
import { buyRandomBox, getMyReferrals, getRandomBoxByUser } from '~/services/box.server';
import dbConnect from '~/services/db.server';
// import { TOKEN } from '~/common/constants';
// import { getHighestGameLevelFromUser } from '~/services/game.server';
// import { purchaseGameBySend } from '~/services/invoice.server';
import { getLedgerBalance } from '~/services/ledger.server';
import { getUser } from '~/services/session.server';
import { getNft } from '~/utils/utils';
import { handleNotAllowedMethod } from '~/utils/utils.server';

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
  const { month } = params;

  if (!month) {
    return redirect('/');
  }

  const nft = getNft(month);

  if (!nft) {
    return redirect('/');
  }

  await dbConnect();
  const user = await getUser(request);
  const psubBalance = await getLedgerBalance(user!._id!);
  const userAddress = await UserAddressModel.findOne({ user });
  const userTransactionPassword = await UserTxHashModel.findOne({ user });
  const myReferralCount = await getMyReferrals(request);
  const randomBox = await getRandomBoxByUser(user!._id!);

  const today = new Date().setHours(0, 0, 0, 0);
  const lastPurchaseDate = new Date(randomBox.lastPurchasedAt!).setHours(0, 0, 0, 0);

  if (lastPurchaseDate < today) {
    randomBox.dailyPurchaseCount = 0;
    randomBox.lastPurchasedAt = new Date();
  }

  await randomBox.save();

  return json({
    nft,
    psubBalance,
    userAddress,
    userTransactionPassword,
    myReferralCount,
    randomBox,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { month } = params;

  if (!month) {
    return redirect('/');
  }

  const nft = getNft(month);

  if (!nft) {
    return redirect('/');
  }

  switch (request.method) {
    // * POST: 코인 송금으로 결제하여 구매
    case 'POST': {
      // return purchaseGameBySend(request, nft);
      return handleNotAllowedMethod();
    }

    // * PUT: PsuB 포인트로 구매
    case 'PUT': {
      return buyRandomBox(request, nft);
      // return handleNotAllowedMethod();
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
