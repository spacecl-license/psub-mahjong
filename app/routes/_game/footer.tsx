import { Link, useLocation } from '@remix-run/react';
import styled, { css, keyframes } from 'styled-components';

import SvgGame from '~/components/icons/game';
import SvgHistory from '~/components/icons/history';
import SvgStar from '~/components/icons/star';

export default function Footer() {

  const location = useLocation();

  return (
    <Wrapper className="game">
      <Nav>
        <NavItem>
          <Link to="/game-hub">
            <IconDark isActive={location.pathname.includes('/game-hub')}>
              <IconWrapper isActive={location.pathname.includes('/game-hub')}>
                <SvgGame />
              </IconWrapper>
              PLAY
            </IconDark>

          </Link>
        </NavItem>
        <NavItem>
          <Link to="/lottery">
            <IconDark isActive={location.pathname === '/lottery'}>
              <IconWrapper isActive={location.pathname === '/lottery'}>
                <SvgStar />
              </IconWrapper>
              LOTTERY
            </IconDark>
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/game-history">
            <IconDark isActive={location.pathname === '/game-history'}>
              <IconWrapper isActive={location.pathname === '/game-history'}>
                <SvgHistory />
              </IconWrapper>
              HISTORY
            </IconDark>
          </Link>
        </NavItem>
      </Nav>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  width: 100%;
  height: 3.75rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  border-radius: 6.25rem 6.25rem 0rem 0rem;
  border: 1px solid var(--cybernetic-modal-border, rgba(255, 255, 255, 0.20));
  background: rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(12px);
  border-bottom: none;
  padding: 0 1rem 1rem 1rem;
  position: fixed; 
  z-index: 11;
  bottom: env(safe-area-inset-bottom);
  left: 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

const NavItem = styled.div`
  text-align: center;
  width: 25%;
`;

const IconDark = styled.div<{ isActive?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  font-family: Inter;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.75rem; 
  text-transform: uppercase;
  text-align: center;
  color: ${({ isActive }) => (isActive ? '#fff' : '#EFEFEF')};
  font-weight: ${({ isActive }) => (isActive ? '700' : '400')};
  position: relative;
  padding-top: 2.3rem;
`;

const moveUpAnimation = keyframes`
  from {
    top: -0.2rem;
  }
  to {
    top: -0.8rem;
  }
`;

const moveDownAnimation = keyframes`
  from {
    top: -0.8rem;
  }
  to {
    top: -0.2rem;
  }
`;

const IconWrapper = styled.div<{ isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ isActive }) => (isActive ? 'linear-gradient(90deg, #12B8FF 0%, #FF007A 100%)' : 'none')};
  border-radius: 50%;
  margin-bottom: ${({ isActive }) => (isActive ? '0.5rem' : '0')};
  position: absolute;
  top : ${({ isActive }) => (isActive ? '-0.8rem' : '-0.2rem')};
  ${({ isActive }) =>
    isActive
      ? css`
          animation: ${moveUpAnimation} 0.3s ease forwards;
        `
      : css`
          animation: ${moveDownAnimation} 0.3s ease forwards; 
    `};

  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    
    path {
      fill : ${({ isActive }) => (isActive ? '#fff' : '#EFEFEF')};
    }
  }
`;
