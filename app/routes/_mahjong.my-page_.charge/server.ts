import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { TOKEN } from '~/common/constants';
import { createChargeInvoice } from '~/services/charge.server';
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

export const loader: LoaderFunction = async ({ request }) => {

  const options = [
    {
      label: TOKEN.PSUB,
      value: TOKEN.PSUB,
    },
    {
      label: TOKEN.USDT,
      value: TOKEN.USDT,
    },
    {
      label: TOKEN.BNB,
      value: TOKEN.BNB,
    },
  ];

  return json({
    depositWalletAddress: process.env.DEPOSIT_WALLET_ADDRESS,
    options,
  });
};

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    // * POST: 코인 송금으로 충전
    case 'POST': {
      return createChargeInvoice(request);
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
