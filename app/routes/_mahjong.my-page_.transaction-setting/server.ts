import type { ActionFunction, MetaFunction } from '@remix-run/node';

import { updatedTransactionPassword } from '~/services/user.server';
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

export const action: ActionFunction = async ({ request }) => {

  switch (request.method) {
    // * POST: 회원 가입
    case 'POST': {
      return updatedTransactionPassword(request);
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
