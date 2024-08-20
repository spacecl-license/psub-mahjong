import { createCookieSessionStorage } from '@remix-run/node';

import { THEME } from '~/common/constants';
import { isTheme } from '~/hooks/use-theme';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'theme',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
  },
});

const getThemeSession = async (request: Request) => {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));

  return {
    getTheme: () => {
      const themeValue = session.get('theme');

      return isTheme(themeValue) ? themeValue : THEME.DARK;
    },
    setTheme: (theme: THEME) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  };
};

export { getThemeSession };
