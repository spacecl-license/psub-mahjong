import type { ActionFunction, MetaFunction } from '@remix-run/node';

import { login } from '~/services/user.server';
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
    // * POST: 로그인
    case 'POST': {
      return login(request);
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
