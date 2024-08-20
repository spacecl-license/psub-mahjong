import { Link, useLocation } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import SvgGame from '~/components/icons/game';
import SvgGameDark from '~/components/icons/game-dark';
import SvgInvite from '~/components/icons/invite';
import SvgInviteDark from '~/components/icons/invite-dark';
import SvgMain from '~/components/icons/main';
import SvgMainDark from '~/components/icons/main-dark';
import SvgRandomBox from '~/components/icons/random-box';
import SvgRandomBoxDark from '~/components/icons/random-box-dark';
import SvgUser from '~/components/icons/user';
import SvgUserDark from '~/components/icons/user-dark';
import { useTheme } from '~/hooks/use-theme';
import { tabState } from '~/recoil/atoms';

export default function Footer() {

  const location = useLocation();
  const { t } = useTranslation('footer');
  const [theme] = useTheme();

  const tab = useRecoilValue(tabState);

  return (
    <Wrapper>
      <Nav>
        <NavItem isActive={location.pathname === '/'}>
          <Link to="/">
            {theme === 'dark' ? (
              <IconDark isActive={location.pathname === '/'}><SvgMainDark /></IconDark>
            ) : (
              <Icon isActive={location.pathname === '/'}><SvgMain /></Icon>
            )}
            {t('首页')}
          </Link>
        </NavItem>
        <NavItem isActive={location.pathname === '/invite'}>
          <Link to="/invite">
            {theme === 'dark' ? (
              <IconDark isActive={location.pathname === '/invite'}><SvgInviteDark /></IconDark>
            ) : (
              <Icon isActive={location.pathname === '/invite'}><SvgInvite /></Icon>
            )}
            {t('邀请')}
          </Link>
        </NavItem>
        <NavItem isActive={location.pathname === '/my-page/my-reward' && tab === 'RANDOM'}>
          <Link to="/my-page/my-reward?tab=RANDOM">
            {theme === 'dark' ? (
              <IconDark isActive={location.pathname === '/my-page/my-reward' && tab === 'RANDOM'}><SvgRandomBoxDark /></IconDark>
            ) : (
              <Icon isActive={location.pathname === '/my-page/my-reward' && tab === 'RANDOM'}><SvgRandomBox /></Icon>
            )}
            {t('幸运盲盒')}
          </Link>
        </NavItem>
        <NavItem isActive={location.pathname === '/game'}>
          <Link to="/game">
            {theme === 'dark' ? (
              <IconDark isActive={location.pathname === '/game'}><SvgGameDark /></IconDark>
            ) : (
              <Icon isActive={location.pathname === '/game'}><SvgGame /></Icon>
            )}
            {t('游戏')}
          </Link>
        </NavItem>
        <NavItem isActive={location.pathname.includes('/my-page') && tab !== 'RANDOM'}>
          <Link to="/my-page">
            {theme === 'dark' ? (
              <IconDark isActive={location.pathname.includes('/my-page')&& tab !== 'RANDOM'}><SvgUserDark /></IconDark>
            ) : (
              <Icon isActive={location.pathname.includes('/my-page')&& tab !== 'RANDOM'}><SvgUser /></Icon>
            )}

            {t('我的')}
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
  justify-content: space-between;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 0.5rem 0 1rem 0;
  position: fixed; 
  z-index: 11;
  bottom: env(safe-area-inset-bottom);
  left: 0;
  background: var(--bg-color); 

`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  /* align-items: center; */
  width: 100%;
`;

const NavItem = styled.div<{ isActive: boolean }>`
  text-align: center;
  width: 20%;

  a {
    text-align: center;
    font-family: Inter;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.75rem; 
    text-transform: uppercase;
    text-align: center;
    color: ${({ isActive }) => (isActive ? 'var(--footer-color)' : 'var(--footer-gray-color)')};
    display: block;
  }

`;

const Icon = styled.div<{ isActive?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.38rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    
    path {
      fill : ${({ isActive }) => (isActive ? 'var(--main-color)' : 'var(--gray)')};
    }
  }
`;

const IconDark = styled.div<{ isActive?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.38rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    
    path {
      fill : ${({ isActive }) => (!isActive && 'var(--gray)')};
    }
  }
`;
