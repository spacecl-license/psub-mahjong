import {  useFetcher, useLoaderData } from '@remix-run/react';
import React, {   useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import BasicHeader from '~/components/section/basic-header';
import { tabState } from '~/recoil/atoms';

import RandomBox from './random-box';
import Reward from './reward';
import type { loader } from './server';
import Swap from './swap';

export { action, loader, meta } from './server';

export interface QuantifyReward {
  month: number;
  quantity: number;
  name: string;
  image: string;
  price: number;
  shortName: string;
  // quantitiesByBonusRate: Record<string, number>;
}

export interface QuantifyRandomBox {
  month: number;
  quantity: number;
  name: string;
}

const MyReward = () => {
  const {
    rewards, randomBox, tab,
  } = useLoaderData<typeof loader>();
  const { t } = useTranslation('my-reward');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRandomBoxModalOpen, setIsRandomBoxModalOpen] = useState(false);
  const [randomBoxNoneModalOpen, setRandomBoxNoneModalOpen] = useState(false);

  const monthlyNames = [
    '松鹤 迷你NFT',
    '梅鸟 迷你NFT',
    '樱花 迷你NFT',
    '黑胡 迷你NFT',
    '兰草 迷你NFT',
    '牡丹 迷你NFT',
    '红胡 迷你NFT',
    '空山 迷你NFT',
    '菊俊 迷你NFT',
    '丹枫 迷你NFT',
    '梧桐 迷你NFT',
    '雨 迷你NFT',
  ];

  const monthlyShortName = [
    '松鹤',
    '梅鸟',
    '樱花',
    '黑胡',
    '兰草',
    '牡丹',
    '红胡',
    '空山',
    '菊俊',
    '丹枫',
    '梧桐',
    '雨',
  ];

  const monthKeys = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];

  const [activeTab, setActiveTab] = useRecoilState(tabState);

  const quantifyRewards = useMemo(() => {
    const hwatoos = Array.from({ length: 12 }).map((_, i) => ({
      month: i + 1,
      name: monthlyNames[i],
      quantity: 0,
      image: `/images/${i + 1}.png`,
      price: 50 * Math.pow(2, i),
      shortName: monthlyShortName[i],
      // quantitiesByBonusRate: {
      //   '0': 0,
      //   '0.2': 0,
      //   '0.3': 0,
      //   '0.5': 0,
      //   '1': 0,
      //   '2': 0,
      //   '10': 0,
      // } as Record<string, number>,
    }));

    rewards.forEach((reward: { level: any; bonusRate: any; }) => {
      const level = reward.level;
      // const bonusRate = reward.bonusRate;
      hwatoos[level - 1].quantity++;

      // if (hwatoos[level - 1].quantitiesByBonusRate.hasOwnProperty(bonusRate)) {
      //   hwatoos[level - 1].quantitiesByBonusRate[bonusRate]++;
      // }
    });

    // 각 hwatoo에 대해 0% 보너스 계산
    // hwatoos.forEach(hwatoo => {
    //   const totalBonusCount = Object.values(hwatoo.quantitiesByBonusRate)
    //     .reduce((acc, count) => acc + count, 0) - hwatoo.quantitiesByBonusRate['0'];
    //   hwatoo.quantitiesByBonusRate['0'] = hwatoo.quantity - totalBonusCount;
    // });

    return hwatoos;
  }, [rewards]);

  const quantifyRandomBox = useMemo<QuantifyRandomBox[]>(() => {
    return monthKeys.map((month, index) => ({
      month: index + 1,
      name: monthlyShortName[index],
      quantity: randomBox ? randomBox[month] : 0,
    }));
  }, [randomBox]);

  const [selectedReward, setSelectedReward] = useState<null | QuantifyReward>(quantifyRewards[0]);
  const [selectedRandomBox, setSelectedRandomBox] = useState<null | QuantifyRandomBox>(quantifyRandomBox[0]);

  const handleRewardClick = (quantifyReward: QuantifyReward) => {
    setSelectedReward(quantifyReward);
    setIsModalOpen(true);
  };

  const handleRandomBoxClick = (quantifyRandomBox: QuantifyRandomBox) => {
    setSelectedRandomBox(quantifyRandomBox);

    if (quantifyRandomBox.quantity === 0) {
      setRandomBoxNoneModalOpen(true);
    } else {
      setIsRandomBoxModalOpen(true);
    }
  };

  const handleSwapClick = (quantifyReward: QuantifyReward) => {
    setSelectedReward(quantifyReward);
  };

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
    }
  };

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }
  , [tab]);

  return (
    <Wrapper>
      <BasicHeader>
        {
          (() => {
            switch (activeTab) {
              case 'RANDOM':
                return 'RANDOM BOX';
              case 'REWARDS':
                return 'MY REWARD';
              case 'SWAP':
                return 'SELECT NFT TO SWAP';
              default:
                return '';
            }
          })()
        }
      </BasicHeader>
      <TabContainer>
        <Tab
          active={activeTab === 'RANDOM'}
          onClick={() => handleRandomBox('RANDOM')}
        >
          {t('幸运盲盒')}
        </Tab>
        <Tab
          active={activeTab === 'REWARDS'}
          onClick={() => handleRandomBox('REWARDS')}
        >
          {t('奖励')}
        </Tab>
        <Tab
          active={activeTab === 'SWAP'}
          onClick={() => handleRandomBox('SWAP')}
        >
          {t('销售')}
        </Tab>
      </TabContainer>
      {activeTab === 'REWARDS' && (
        <Reward
          quantifyRewards={quantifyRewards}
          onRewardClick={handleRewardClick}
          selectedReward={selectedReward!}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      {activeTab === 'SWAP' && (
        <Swap
          rewards={rewards}
          quantifyRewards={quantifyRewards}
          selectedReward={selectedReward!}
          onRewardClick={handleSwapClick}
        />
      )}
      {activeTab === 'RANDOM' && (
        <RandomBox
          quantifyRandomBox={quantifyRandomBox}
          onRandomBoxClick={handleRandomBoxClick}
          selectedRandomBox={selectedRandomBox!}
          isModalOpen={isRandomBoxModalOpen}
          setIsModalOpen={setIsRandomBoxModalOpen}
          randomBoxNoneModalOpen={randomBoxNoneModalOpen}
          setRandomBoxNoneModalOpen={setRandomBoxNoneModalOpen}
          isAutoBattle={randomBox.isAutoBetting}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

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

export default MyReward;
