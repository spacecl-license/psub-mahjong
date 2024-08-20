import { Link } from '@remix-run/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Arrow } from '~/components/icons';
import BasicHeader from '~/components/section/basic-header';

const Setting = () => {
  const { t } = useTranslation('inquiry');

  return (
    <>
      <BasicHeader>
        CS CENTER
      </BasicHeader>
      <Title>
        {t('经常问的问题在公告事项上有说明。')}
      </Title>
      <Link to="/my-page/inquiry">
        <Wrapper>
          <GroupWapper>
            <TitleGroup>
              <label>{t('询问')}</label>
            </TitleGroup>
            <MoreWapper>
              <Arrow />
            </MoreWapper>
          </GroupWapper>
        </Wrapper>
      </Link>
      <Link to="/my-page/my-inquiry">
        <Wrapper>
          <GroupWapper>
            <TitleGroup>
              <label>{t('我的咨询内容')}</label>
            </TitleGroup>
            <MoreWapper>
              <Arrow />
            </MoreWapper>
          </GroupWapper>
        </Wrapper>
      </Link>
      <Link to="/my-page/notice">
        <Wrapper>
          <GroupWapper>
            <TitleGroup>
              <label>{t('通知')}</label>
            </TitleGroup>
            <MoreWapper>
              <Arrow />
            </MoreWapper>
          </GroupWapper>
        </Wrapper>
      </Link>
    </>
  );
};

const Title = styled.div`
  width: 100%;
  padding: 1.5rem 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border-bottom-color);
  color: var(--content-color);
  text-align: center;
  font-family: "Noto Sans SC" !important;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; 
`;

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

export default Setting;
