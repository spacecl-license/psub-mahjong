import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirectDocument } from '@remix-run/node';

import { THEME } from '~/common/constants';
import { getUser } from '~/services/session.server';
import { getThemeSession } from '~/services/theme.server';
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

  const {
    getTheme, setTheme, commit,
  } = await getThemeSession(request);

  const theme = getTheme();

  if (!theme || theme === THEME.LIGHT) {
    setTheme(THEME.DARK);
    const cookieHeader = await commit();

    const userReferral = await getUserReferralFromUser(user._id!);
    return new Response(JSON.stringify({ user, userReferral }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieHeader,
      },
    });
  }

  const userReferral = await getUserReferralFromUser(user._id!);

  return json({
    user,
    userReferral,
  });
};
