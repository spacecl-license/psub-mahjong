import { Link } from '@remix-run/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { THEME } from '~/common/constants';
import { Arrow } from '~/components/icons';
import SettingProfile from '~/components/items/setting-profile';
import BasicHeader from '~/components/section/basic-header';
import { useTheme } from '~/hooks/use-theme';
import { userState } from '~/recoil/atoms';

const Setting = () => {
  const user = useRecoilValue(userState);
  const { t } = useTranslation('setting');
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK);
  };

  return (
    <>
      <BasicHeader>
        Setting
      </BasicHeader>
      <SettingProfile user={user!} />
      <Link to="/my-page/address-setting">
        <Wrapper>
          <GroupWapper>
            <TitleGroup>
              <label>{t('钱包地址')}</label>
            </TitleGroup>
            <MoreWapper>
              <Arrow />
            </MoreWapper>
          </GroupWapper>
        </Wrapper>
      </Link>
      <Link to="/my-page/transaction-setting">
        <Wrapper>
          <GroupWapper>
            <TitleGroup>
              <label>{t('交易密码')}</label>
            </TitleGroup>
            <MoreWapper>
              <Arrow />
            </MoreWapper>
          </GroupWapper>
        </Wrapper>
      </Link>
      <Wrapper>
        <GroupWapper>
          <TitleGroup>
            <label>{t('控制论主题')}</label>
          </TitleGroup>
          <div>
            <ToggleButton
              onClick={toggleTheme}
              isActive={theme === THEME.DARK}
            />
          </div>
        </GroupWapper>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 1.5rem 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border-bottom-color);
`;

const GroupWapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;

  & > label {
    color: var(--font-color);
    font-family: Montserrat !important;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1rem;
    text-transform: uppercase;
  }

`;

const MoreWapper = styled.div`
  transform: rotate(-90deg);

  & > svg {
    width: 1.25rem;
    height: 1.25rem;
    path {
      fill: var(--input-dark-sub2);
    }
  }
`;

const ToggleButton = styled.div<{ isActive: boolean }>`
  position: relative;
  width: 3.5rem;
  height: 1.35rem;
  border-radius: 0.75rem;
  background-color: ${({ isActive }) => (isActive ? '#3B3F88' : '#ccc')};
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: -0.11rem;
    left: ${({ isActive }) => (isActive ? '2.1rem' : '-0.1rem')};
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background-color: ${({ isActive }) => (isActive ? '#FF007A' : '#AAA')};
    transition: left 0.3s;
  }
`;

export default Setting;
