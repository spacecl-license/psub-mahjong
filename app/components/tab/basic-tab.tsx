import { useFetcher } from '@remix-run/react';
import React from 'react';
import styled from 'styled-components';

interface ITabsProps {
  firstTabTitle: string;
  secondTabTitle: string;
  firstTabValue: string;
  secondTabValue: string;
  activeTab: string;
  setActiveTab: any;
  thirdTabTitle?: string;
  thirdTabValue?: string;
}

// 탭 컴포넌트
export const BasicTab: React.FC<ITabsProps> = ({
  firstTabTitle,
  secondTabTitle,
  firstTabValue,
  secondTabValue,
  activeTab,
  setActiveTab,
  thirdTabTitle,
  thirdTabValue,
}) => {

  const fetcher = useFetcher();

  const handleRandomBox = (value : string) => {
    if (value === 'RANDOM'){
      setActiveTab('RANDOM');
      fetcher.load('/my-page/my-reward?tab=RANDOM');
      window.history.pushState('', '', '/my-page/my-reward?tab=RANDOM');
    } else if (value === 'REWARDS'){
      setActiveTab('REWARDS');
      fetcher.load('/my-page/my-reward');
      window.history.pushState('', '', '/my-page/my-reward');
    } else if (value === 'SWAP'){
      setActiveTab('SWAP');
      fetcher.load('/my-page/my-reward');
      window.history.pushState('', '', '/my-page/my-reward');
    } else {
      setActiveTab(value);
    }

  };
  return (
    <TabContainer>
      <Tab
        active={activeTab === firstTabValue}
        onClick={() => handleRandomBox(firstTabValue)}
      >
        {firstTabTitle}
      </Tab>
      <Tab
        active={activeTab === secondTabValue}
        onClick={() => handleRandomBox(secondTabValue)}
      >
        {secondTabTitle}
      </Tab>
      {thirdTabTitle && thirdTabValue && (
        <Tab
          active={activeTab === thirdTabValue}
          onClick={() => handleRandomBox(thirdTabValue)}
        >
          {thirdTabTitle}
        </Tab>
      )}
    </TabContainer>
  );
};

// 스타일 컴포넌트들
const TabContainer = styled.div`
  display: flex;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1.31rem 1.25rem;
  height: 4rem;
  cursor: pointer;
  background: none;
  border: none;
  color: ${({ active }) => (active ? 'var(--input-dark-sub2)' : 'var(--gray)')};
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  font-family: "Noto Sans SC";
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ active }) => (active ? 'var(--bg-color)' : 'var(--reward-bg)')};
`;
