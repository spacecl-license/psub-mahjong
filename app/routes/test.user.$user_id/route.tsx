import { Link, useLoaderData } from '@remix-run/react';
import { formatEther } from 'ethers/lib/utils';
import styled from 'styled-components';

import { toComma } from '~/utils/utils';

import type { loader } from './server';

export { loader, meta } from './server';

export default function Test() {
  const { ledgerBalance, games } = useLoaderData<typeof loader>();
  const gs = games as any;

  return (
    <Wrapper>
      <h1>{`id: ${gs[0].userReferral?.user?.id}`}</h1>
      <h1>
        리워드 잔액:&nbsp;
        {toComma(formatEther(ledgerBalance))}
      </h1>
      <h1>게임 리스트</h1>

      {gs.map((game: any) => {
        return (
          <div key={game._id}>
            <Link to={`/test/game/${game._id}`}>
              {`${game.level}-${game.round}`}
            </Link>
          </div>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  padding: 1rem 0.5rem;

    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 1rem 0;
      margin-bottom: 1rem;


      & > a {
        padding: 0 0.5rem;
        font-size: 2rem;
      }
    }
`;
