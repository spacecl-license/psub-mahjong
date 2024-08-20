import type { LinksFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react';
import { RecoilRoot } from 'recoil';
import styled from 'styled-components';

import LoadingDots from '~/components/items/loading';
import type User from '~/models/user';
import type UserReferral from '~/models/user-referral';
import { userReferralState, userState } from '~/recoil/atoms';

import Footer from './footer';
import Header from './header';
import type { loader } from './server';

export { loader } from './server';

export const links: LinksFunction = () => {
  return [
    { rel: 'preload', href: '/images/rank5.png', as: 'image' },
    { rel: 'preload', href: '/images/rank4.png', as: 'image' },
    { rel: 'preload', href: '/images/rank3.png', as: 'image' },
    { rel: 'preload', href: '/images/rank2.png', as: 'image' },
    { rel: 'preload', href: '/images/rank1.png', as: 'image' },
    { rel: 'preload', href: '/images/count0.png', as: 'image' },
    { rel: 'preload', href: '/images/count1.png', as: 'image' },
    { rel: 'preload', href: '/images/count2.png', as: 'image' },
    { rel: 'preload', href: '/images/count3.png', as: 'image' },
  ];
};

export default function Default() {
  const { user, userReferral } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';

  return (
    <RecoilRoot
      initializeState={({ set }) => {
        set(userState, user as unknown as User);
        set(userReferralState, userReferral as unknown as UserReferral);
      }}
    >
      <Header  />
      <Main className="game">
        <Outlet />
      </Main>
      <Footer />
      {isNavigating && <LoadingDots />}
    </RecoilRoot>
  );
}

const Main = styled.main`
  height: 100%;
  padding-bottom: 3.75rem;
  padding-top: 4rem;
  background-color: var(--reward-bg2);
`;
