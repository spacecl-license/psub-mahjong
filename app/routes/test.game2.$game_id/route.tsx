import { Link, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import styled from 'styled-components';

import type GameV2 from '~/models/game-v2';
import type User from '~/models/user';
import type UserReferral from '~/models/user-referral';

import type { loader } from './server';

export { loader, meta } from './server';

export default function Test() {
  const { game, aboveGame } = useLoaderData<typeof loader>();
  const g = game as any;

  useEffect(() => {
    console.info('game', game);
    console.info('aboveGame', aboveGame);
  }, [game, aboveGame]);

  return (
    <Wrapper>
      <h1>{`id: ${g?.userReferral?.user?.id}`}</h1>
      <h1>{`referralCode: ${g?.userReferral?.referralCode}`}</h1>
      <h1>{`above referral: ${g?.userReferral?.referral?.user?.id}`}</h1>
      {aboveGame && (
        <Link to={`/test/game2/${aboveGame._id}`}>
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
          <Link to={`/test/game2/${g._id}`}>
            {g?.userReferral?.user?.id}
          </Link>
        </div>
        <div>
          {game.children.map((child: GameV2, i: number) => (
            <Link
              key={i}
              to={`/test/game2/${child._id}`}
            >
              {((child.userReferral as UserReferral)?.user as User)?.id ?? '.'}
            </Link>
          ))}
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
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      padding: 1rem 0;

      &:first-child {
        justify-content: center;
      }

      & > a {
        padding: 0 0.5rem;
        font-size: 0.85rem;
        margin-right: 1rem;
      }
    }
  }
`;
