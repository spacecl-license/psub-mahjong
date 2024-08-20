import { Outlet, useLoaderData, useNavigation } from '@remix-run/react';
import { RecoilRoot } from 'recoil';
import styled from 'styled-components';

import LoadingDots from '~/components/items/loading';
import type User from '~/models/user';
import type UserReferral from '~/models/user-referral';
import { userReferralState, userState } from '~/recoil/atoms';

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
      <Main className="chart">
        <Outlet />
      </Main>
      {isNavigating && <LoadingDots />}
    </RecoilRoot>
  );
}

const Main = styled.main`
  height: 100%;
  padding-top: 3rem;
`;
