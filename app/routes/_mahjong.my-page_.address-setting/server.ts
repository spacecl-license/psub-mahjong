import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { UserAddressModel } from '~/models';
import dbConnect from '~/services/db.server';
import { getUser } from '~/services/session.server';
import { createAddress } from '~/services/user-address.server';
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
  await dbConnect();
  const user = await getUser(request);
  const userAddress = await UserAddressModel.findOne({ user });

  return json({
    userAddress,
  });
};

export const action: ActionFunction = async ({ request }) => {

  switch (request.method) {
    // * POST: 회원 가입
    case 'POST': {
      return createAddress(request);
    }

    default: {
      return handleNotAllowedMethod();
    }
  }
};
