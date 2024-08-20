import { Link, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import styled from 'styled-components';

import type { loader } from './server';

export { loader, meta } from './server';

export default function Test() {
  const { game, aboveGame } = useLoaderData<typeof loader>();
  const g = game as any;

  useEffect(() => {
    console.info('game', game);
  }, [game]);

  return (
    <Wrapper>
      <h1>{`id: ${g?.userReferral?.user?.id}`}</h1>
      <h1>{`referralCode: ${g?.userReferral?.referralCode}`}</h1>
      <h1>{`above referral: ${g?.userReferral?.referral?.user?.id}`}</h1>
      {aboveGame && (
        <Link to={`/test/game/${aboveGame._id}`}>
          above game:&nbsp;
          {aboveGame?.userReferral?.user?.id}
          &nbsp;/&nbsp;
          {aboveGame?.level}
          -
          {aboveGame?.round}
        </Link>
      )}
      <h1>{`level: ${g?.level}`}</h1>
      <h1>{`round: ${g?.round}`}</h1>
      <h1>{`status: ${g?.status}`}</h1>
      <section>
        <div>
          <Link to={`/test/game/${g._id}`}>
            {g?.userReferral?.user?.id}
          </Link>
        </div>
        <div style={{ justifyContent: 'space-around' }}>
          <Link to={`/test/game/${g?.left?._id}`}>
            {g?.left?.userReferral?.user?.id ?? '.'}
          </Link>
          <Link to={`/test/game/${g?.right?._id}`}>
            {g?.right?.userReferral?.user?.id ?? '.'}
          </Link>
        </div>
        <div>
          <Link to={`/test/game/${g?.left?.left?._id}`}>
            {g?.left?.left?.userReferral?.user?.id ?? '.'}
          </Link>
          <Link to={`/test/game/${g?.left?.right?._id}`}>
            {g?.left?.right?.userReferral?.user?.id ?? '.'}
          </Link>
          <Link to={`/test/game/${g?.right?.left?._id}`}>
            {g?.right?.left?.userReferral?.user?.id ?? '.'}
          </Link>
          <Link to={`/test/game/${g?.right?.right?._id}`}>
            {g?.right?.right?.userReferral?.user?.id ?? '.'}
          </Link>
        </div>
      </section>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  max-width: 40rem;
  padding: 1rem 0.5rem;

  & > section {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 2.5rem;

    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 1rem 0;

      &:first-child {
        justify-content: center;
      }

      & > a {
        padding: 0 0.5rem;
        font-size: 0.85rem;
      }
    }
  }
`;
