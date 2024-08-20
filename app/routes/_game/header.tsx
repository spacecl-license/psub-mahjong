import { Link, useLocation } from '@remix-run/react';
import styled from 'styled-components';

import SvgMain from '~/components/icons/main';
import GameLanguageToggle from '~/components/items/game-language';

export default function Header() {

  const location = useLocation();

  return (
    <Wrapper className="game">
      {location.pathname !== '/game-hub/battle-room' ? (
        <Link to="/">
          <SvgMain />
        </Link>
      ): (
        <Dummy />
      )}
      GAME
      <GameLanguageToggle />
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem; 
  text-transform: uppercase;
  height : 4rem;
  text-transform: uppercase;
  color: var(--header-color);
  position: fixed;
  width: 100%;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    path {
      fill: var(--dark-gray-3);
    }
  }
`;

const Dummy = styled.div`
  width: 1.5rem;
  height: 1.5rem;
`;
