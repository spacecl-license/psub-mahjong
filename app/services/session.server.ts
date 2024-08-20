import { createCookieSessionStorage, redirect } from '@remix-run/node';

import type User from '~/models/user';

const USER_SESSION_KEY = 'user';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET ?? ''],
    secure: process.env.NODE_ENV === 'production',
  },
});

const getSession = async (request: Request) => {
  const cookie = request.headers.get('Cookie');

  return sessionStorage.getSession(cookie);
};

// * 세션에서 유저 조회
export const getUser = async (
  request: Request,
): Promise<User | undefined> => {
  const session = await getSession(request);

  return session.get(USER_SESSION_KEY);
};

// * 세션에서 모달 조회
export const getShowModal = async (request: Request): Promise<boolean> => {
  const session = await getSession(request);

  return session.get('showModal');
};

// * 세션에서 모달 제거
export const removeShowModal = async (request: Request) => {
  const session = await getSession(request);

  session.set('showModal', false);

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
};

// * 유저 세션 생성
export const signIn = async ({
  request,
  user,
}: {
  request: Request;
  user: User;
}) => {
  const session = await getSession(request);

  session.set(USER_SESSION_KEY, user);
  session.set('showModal', true);

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 1, // 1일
      }),
    },
  });
};

// * 유저 세션 제거
export const signOut = async (request: Request) => {
  const session = await getSession(request);

  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
};
