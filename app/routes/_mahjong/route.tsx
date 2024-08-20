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
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
      {isNavigating && <LoadingDots />}
    </RecoilRoot>
  );
}

const Main = styled.main`
  height: calc(100vh-3.75rem);
  padding-bottom: 3.75rem;
`;
