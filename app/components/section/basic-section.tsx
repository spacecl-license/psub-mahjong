import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type BasicSectionProps = {
  children: React.ReactNode;
  commission?: boolean;
  headerContent: React.ReactNode;
  headerProfile?: boolean;
};

const BasicSection: React.FC<BasicSectionProps> = ({
  headerContent, children, commission, headerProfile,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('my-wallet');

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, commission]);

  return (
    <Container
      isExpanded={isExpanded}
      contentHeight={contentHeight}
    >
      <HeaderWrapper
        onClick={toggleExpansion}
        className={clsx(['section'])}
      >
        {headerProfile && (
          <ProfilePic
            src="/images/basic-profile.png"
            alt="Friend's Profile"
          />
        )}
        {headerContent}
      </HeaderWrapper>
      <Content
        isExpanded={isExpanded}
        ref={contentRef}
      >
        {commission && (
          <CommissionWrapper>
            <span>{t('提现手续费')}</span>
            <span>5%</span>
          </CommissionWrapper>
        )}
        {children}
      </Content>
    </Container>
  );
};

const Container = styled.div<{ isExpanded: boolean, contentHeight : number }>`
  position: fixed;
  left: 0;
  bottom: 3.75rem;
  width: 100%;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isExpanded, contentHeight }) => (isExpanded ? `translateY(${contentHeight})` : 'translateY(0)')};
  z-index: 5;
  max-height: 100vh; 
  display: flex;
  flex-direction: column;
  justify-content: flex-end; 

`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  color: white;
  background-color: var(--gray);
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1rem;
  text-transform: uppercase;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  box-shadow: 0px -2px 2px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  z-index: 10; 
`;

const Content = styled.div<{ isExpanded: boolean }>`
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s linear;
  background-color: var(--bg-color);
  box-shadow: 0px -2px 2px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  max-height: ${({ isExpanded }) => (isExpanded ? 'calc(100vh - 4.4rem)' : '0')}; 
  opacity: ${({ isExpanded }) => (isExpanded ? '1' : '0')};
  visibility: ${({ isExpanded }) => (isExpanded ? 'visible' : 'hidden')};
  z-index: 4;
`;

const CommissionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-bottom-color);
  padding: 0.75rem 1.25rem;
   
  & > span:first-child {
    color: var(--input-dark-sub);
    font-family: "Noto Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
  }

  & > span:last-child {
    text-align: right;
    font-family: Montserrat;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
    text-transform: uppercase;
    color: var(--dark-text-sub2);
  }
`;

const ProfilePic = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  margin-right: 0.4rem;
`;

export default BasicSection;
