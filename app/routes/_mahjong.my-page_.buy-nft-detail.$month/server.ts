import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';

import { UserAddressModel, UserTxHashModel } from '~/models';
import dbConnect from '~/services/db.server';
// import { TOKEN } from '~/common/constants';
// import { getHighestGameLevelFromUser } from '~/services/game.server';
// import { purchaseGameBySend } from '~/services/invoice.server';
import { getLedgerBalance, purchaseGameV2ByLedger } from '~/services/ledger.server';
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

  // const highestEndedGameLevel = await getHighestGameLevelFromUser(user!._id!, true);

  // let options = Object.entries(nft.price).map(([key]) => ({
  //   label: key,
  //   value: key,
  // }));

  // if (process.env.TEST_NET !== 'true') {
  //   options = options.filter(item => item.label !== TOKEN.T_PSUB);
  // }

  // TODO: 현재 PsuB, USDT로만 구매 가능. 차후 다른 토큰 옵션 적용
  // const options = [
  //   {
  //     label: TOKEN.PSUB,
  //     value: TOKEN.PSUB,
  //   },
  //   {
  //     label: TOKEN.USDT,
  //     value: TOKEN.USDT,
  //   },
  //   {
  //     label: TOKEN.BNB,
  //     value: TOKEN.BNB,
  //   },
  // ];

  return json({
    nft,
    psubBalance,
    userAddress,
    userTransactionPassword,
    // highestEndedGameLevel,
    // depositWalletAddress: process.env.DEPOSIT_WALLET_ADDRESS,
    // depositTronAddress: process.env.DEPOSIT_TRON_ADDRESS,
    // options,
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
      return purchaseGameV2ByLedger(request, nft);
      // return handleNotAllowedMethod();
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
