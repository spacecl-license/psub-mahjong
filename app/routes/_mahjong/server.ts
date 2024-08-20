import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirectDocument } from '@remix-run/node';

import { getUser } from '~/services/session.server';
import { getUserReferralFromUser } from '~/services/user.server';

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

  if (!user) {
    return redirectDocument('/login');
  }

  const userReferral = await getUserReferralFromUser(user._id!);

  return json({
    user,
    userReferral,
  });
};
