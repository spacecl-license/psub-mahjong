import { Link } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgArrow from '~/components/icons/arrow';
import SvgClose from '~/components/icons/close';
import SvgGuide from '~/components/icons/guide';
import SvgHamburger from '~/components/icons/hamburger';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [tapActive, setTapActive] = useState('hierarchy');
  const { i18n } = useTranslation();

  const { t } = useTranslation('chart');
  const wrapperRef : any = useRef(null);

  const isChinese = i18n.language === 'cn';

  const toggleLanguage = () => {
    const newLang = isChinese ? 'en' : 'cn';
    i18n.changeLanguage(newLang);
  };

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
    setGuideOpen(false);
  };

  const handleGuideOpen = () => {
    setGuideOpen(!guideOpen);
    setMenuOpen(false);
  };

  const handleClickOutside = (event : any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setGuideOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Wrapper className="chart">
        <IconWrapper>
          {menuOpen ? (
            <SvgClose onClick={() => handleMenuOpen()} />
          ) : (
            <SvgHamburger onClick={() => handleMenuOpen()} />
          )}
          <SvgGuide onClick={() => handleGuideOpen()} />
        </IconWrapper>
        {menuOpen && (
          <Menu>
            <Link to="/game-hub">
              <MenuItem>
                {t('返回Gaming Hub')}
                <SvgArrow style={{ transform : 'rotate(-90deg)' }} />
              </MenuItem>
            </Link>
            <MenuItem onClick={toggleLanguage}>
              {t('更改语言')}
              <span>{isChinese ? '中文' : 'English'}</span>
            </MenuItem>
          </Menu>
        )}
        {guideOpen && (
          <InformationWrapper ref={wrapperRef}>
            <TapContainer>
              <Tap
                active={tapActive === 'hierarchy'}
                onClick={() => setTapActive('hierarchy')}
              >
                {t('职级结构')}
              </Tap>
              <Tap
                active={tapActive === 'reward'}
                onClick={() => setTapActive('reward')}
              >
                {t('奖励结构')}
              </Tap>
            </TapContainer>
            {tapActive === 'hierarchy' && (
              <Information>
                <div>
                  <h1>
                    &lt;
                    {' '}
                    {t('下位销售')}
                    {' '}
                    &gt;
                  </h1>
                  <p>
                    {t('大线除外，小线合计')}
                  </p>
                </div>
                <div>
                  <h1>
                    &lt;
                    {' '}
                    {t('HT职级达成基准')}
                    {' '}
                    &gt;
                  </h1>
                  <p>
                    {t('HT 1万美元以下 HT1 达成1万美元 HT2 达成3万美元 HT3 达成9万美元 HT4 达成30万美元 HT5 达成100万美元')}
                  </p>
                </div>
              </Information>
            )}
            {tapActive === 'reward' && (
              <Information>
                <div>
                  <h1>
                    &lt;
                    {' '}
                    {t('HT 各等级 %')}
                    {' '}
                    &gt;
                  </h1>
                  <p>
                    {t('HT1 销售额1万USD，销售额的5% HT2 销售额 3万 USD. 销售额的8% HT3 销售额9万USD，销售额的12% HT4 销售额30万USD，销售额的16% HT5 销售额100万USD，销售额的20% 直、下位销售额的5% (达成HT1时可获取) 下位收益的10% (职级以上时可获取) 下级超过职位时10%的补偿断绝')}
                  </p>
                </div>
              </Information>
            )}
          </InformationWrapper>
        )}
      </Wrapper>
    </div>
  );
}

const Wrapper = styled.header`
  width: 100%;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.75rem;
  font-family: "Noto Sans SC";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
  text-transform: uppercase;
  height : 3rem;
  text-transform: uppercase;
  color: var(--header-color);
  background-color: #fff;
  position: fixed;
  width: 100%;
  z-index: 999;

  & > svg:first-child {
    width: 1.5rem;
    height: 1.5rem;
    path {
      fill: black;
    }
  }

  & > svg:last-child {
    width: 1.5rem;
    height: 1.5rem;
    path {
      fill: var(--dark-sub);
    }
  }
`;

const Menu = styled.div`
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 999;
  position: fixed;
  top: 3rem;
`;

const MenuItem = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--hanafuda-Text, #121212);
  font-family: "Noto Sans SC";
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1rem;
  cursor: pointer;

  & > svg {
    width: 1rem;
    height: 1rem;
    path {
      fill: #3B3F88;
    }
  }

  & > span {
    color: var(--cybernetic-Sub-color, #3B3F88);
    font-family: "Noto Sans SC";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem; /* 100% */
  }
`;

const InformationWrapper = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 999;
  position: fixed;
  padding : 0 1rem 1rem 1rem;
  top: 3rem;
  width: 90%;
  margin-top: 7rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const TapContainer = styled.div`
  display: flex;
  width: 100%;

`;

const Tap = styled.button<{ active: boolean }>`
  flex: 1;
  height: 3rem;
  cursor: pointer;
  background: none;
  border: none;
  border-bottom: ${({ active }) => (active ? '1px solid #12B8FF' : 'none')};
  color: var(--hanafuda-Text, #121212);
  font-family: "Noto Sans SC";
  font-size: 1rem;
  font-style: normal;
  font-weight: ${({ active }) => (active ? '700' : '400')};
  line-height: 1rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  padding : 1rem 0;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.13rem;
  margin-top: 1.25rem;
  width: 100%;

    & > div {
      & > h1 {
        color: #000;
        font-family: "Noto Sans SC";
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 500;
        line-height: 1.25rem;
        margin-bottom : 0.25rem; 
      }

      & > p {
        color: #000;
        font-family: "Noto Sans SC";
        font-size: 0.75rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.25rem;
        margin-left : 0.88rem;
        white-space: pre-line;
      }
    }

`;
