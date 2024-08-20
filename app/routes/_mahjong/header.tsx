import { Link, useLocation, useNavigate } from '@remix-run/react';
import { useMemo } from 'react';
import styled from 'styled-components';

import SvgArrow from '~/components/icons/arrow';
import LanguageToggle from '~/components/items/language';
import { useTheme } from '~/hooks/use-theme';

export default function Header() {

  const location = useLocation();
  const [theme] = useTheme();

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  // 현재 위치에 따라 표시할 제목 결정
  const title = useMemo(() => {
    switch (location.pathname) {
      case '/':
        return theme === 'dark' ? (
          <img
            src="/images/logo-dark.png"
            alt="PSUB"
            style={{
              width: '7.25rem',
              height: '2.5rem',
            }}
          />
        ) : (
          <img
            src="/images/logo.png"
            alt="PSUB"
            style={{
              width: '7.25rem',
              height: '2.5rem',
            }}
          />
        );
      case '/invite':
        return 'INVITE';
      case '/game':
        return theme === 'dark' ? (
          <img
            src="/images/logo-dark.png"
            alt="PSUB"
            style={{
              width: '7.25rem',
              height: '2.5rem',
            }}
          />
        ) : (
          <img
            src="/images/logo.png"
            alt="PSUB"
            style={{
              width: '7.25rem',
              height: '2.5rem',
            }}
          />
        );
      case '/my-page':
        return 'MY PAGE';
      case '/my-page/buy-nft':
        return <Link to="/my-page"><SvgArrow style={{ transform : 'rotate(90deg)' }} /></Link>;
      case '/my-page/buy-nft-detail':
        return <Link to="/my-page/buy-nft"><SvgArrow style={{ transform : 'rotate(90deg)' }} /></Link>;
      case '/my-page/receipt':
        return <Link to="/my-page"><SvgArrow style={{ transform : 'rotate(90deg)' }} /></Link>;
      case '/my-page/my-reward':
        return <Link to="/my-page"><SvgArrow style={{ transform : 'rotate(90deg)' }} /></Link>;
      case '/my-page/my-wallet':
        return <Link to="/my-page"><SvgArrow style={{ transform : 'rotate(90deg)' }} /></Link>;
      case '/my-page/withdraw':
        return <Link to="/my-page/my-wallet"><SvgArrow style={{ transform : 'rotate(90deg)' }} /></Link>;
      case '/my-page/transfer':
        return <Link to="/my-page/my-wallet"><SvgArrow style={{ transform : 'rotate(90deg)' }} /></Link>;
      case '/my-page/history':
        return <Link to="/my-page/my-wallet"><SvgArrow style={{ transform : 'rotate(90deg)' }} /></Link>;
      case '/my-page/friend':
        return <Link to="/my-page"><SvgArrow style={{ transform : 'rotate(90deg)' }} /></Link>;
      case '/my-page/setting':
        return <Link to="/my-page"><SvgArrow style={{ transform : 'rotate(90deg)' }} /></Link>;
      default:
        return (
          <div>
            <SvgArrow
              style={{ transform : 'rotate(90deg)' }}
              onClick={goBack}
            />
          </div>
        );
    }
  }, [location.pathname, theme]);

  return (
    <Wrapper>
      {title}
      <LanguageToggle />
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  font-family: Montserrat;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem; 
  height : 4rem;
  text-transform: uppercase;
  color: var(--header-dark-color);

  svg {
    path {
      fill: var(--header-dark-color);
    }
  }
`;
