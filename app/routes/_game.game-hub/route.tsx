import { useFetcher, useLoaderData } from '@remix-run/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgArrow from '~/components/icons/arrow';
import GameHeader from '~/components/section/game-header';
import { userState } from '~/recoil/atoms';

import Channel from './channel';
import Mode from './mode';
import type { loader } from './server';

export { action, loader, meta } from './server';

export interface QuantifyRandomBox {
  month: number;
  quantity: number;
  name: string;
  image: string;
}

const GameHub = () => {
  const { randomBox } = useLoaderData<typeof loader>();
  const { t } = useTranslation('game-hub');
  const user = useRecoilValue(userState);
  const [channelOpen, setChannelOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);

  const [gameMatching, setGameMatching] = useState(false);

  const [searchingDots, setSearchingDots] = useState('');

  const fetcher : any = useFetcher();

  useEffect(() => {
    let dotsInterval: NodeJS.Timeout;

    if (gameMatching) {
      let dotsCount = 0;

      dotsInterval = setInterval(() => {
        dotsCount = (dotsCount + 1) % 4;
        setSearchingDots('.'.repeat(dotsCount));
      }, 500);

    }

    return () => clearInterval(dotsInterval);
  }, [gameMatching]);

  const monthlyNames = [
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
  const [mode, setMode] = useState('2p');

  const quantifyRandomBox = useMemo<QuantifyRandomBox[]>(() => {
    return monthKeys.map((month, index) => ({
      month: index + 1,
      name: monthlyNames[index],
      quantity: randomBox ? randomBox[month] + randomBox[month + 'Ticket'] : 0,
      image: `/images/reward${index + 1}.png`,
    }));
  }, [randomBox]);

  const initialMonthly = useMemo(() => {
    const availableReward = quantifyRandomBox.find(randomBox => randomBox.quantity > 0);
    return availableReward ? availableReward.month : 0;
  }, [quantifyRandomBox]);

  const [monthly, setMonthly] = useState<number>(initialMonthly);

  const handleStartClick = () => {
    setGameMatching(true);
    fetcher.submit({ monthly, mode }, { method: 'POST' });
  };

  // const handleCancelClick = () => {
  //   setGameMatching(false);
  // };

  const modeName = (mode: string) => {
    switch (mode) {
      case '2p':
        return `2${t('名游戏者')}`;
      case '3p':
        return `3${t('名游戏者')}`;
      case '5p':
        return `5${t('名游戏者')}`;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (fetcher.data && fetcher.data.error && fetcher.state === 'idle') {
      switch ((fetcher.data as any).error) {
        case 'Not enough players':
          setGameMatching(false);
          alert('Not enough players');
          break;
        case 'Invalid time to play game. Please try again later.':
          setGameMatching(false);
          alert('Invalid time to play game. Please try again later.');
          break;
        default:
          alert('Game matching failed');
          setGameMatching(false);
          break;
      }
    }
  }, [fetcher]);

  return (
    <Wrapper>
      {!channelOpen && !modeOpen && (
        <>
          <GameHeader>
            {t('幸运抽奖箱战斗')}
          </GameHeader>
          <ProfileWrapper>
            <div>
              {user!.id}
            </div>
          </ProfileWrapper>
          <BattleSetting>
            <div>
              <div >
                <div >
                  {t('战斗设置')}
                </div>
                <div>
                  <div onClick={() => setChannelOpen(!channelOpen)}>
                    <ContentHeader>{t('频道')}</ContentHeader>
                    <Content>
                      {monthlyNames[monthly - 1]}
                      <SvgArrow style={{ transform : 'rotate(270deg)' }} />
                    </Content>
                  </div>
                  <div onClick={() => setModeOpen(!modeOpen)} >
                    <ContentHeader>{t('模式')}</ContentHeader>
                    <Content>
                      {modeName(mode)}
                      <SvgArrow style={{ transform : 'rotate(270deg)' }} />
                    </Content>
                  </div>
                </div>
              </div>
            </div>
          </BattleSetting>
          <BasicButton
            onClick={handleStartClick}
            disabled={gameMatching}
          >
            {gameMatching ? `${t('游戏搜索')}${searchingDots}` : t('开始')}
          </BasicButton>
          {/* {gameMatching && (
            <BasicButton
              onClick={handleCancelClick}
              variant="reversal"
            >
              {t('取消')}
            </BasicButton>
          )} */}
        </>
      )}
      {channelOpen && (
        <Channel
          quantifyRandomBox={quantifyRandomBox}
          setMonthly={setMonthly}
          setChannelOpen={setChannelOpen}
        />
      )}
      {modeOpen && (
        <Mode
          setMode={setMode}
          setModeOpen={setModeOpen}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  color: var(--font-color);
  padding: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--reward-bg2);
  padding-bottom : 6rem;
`;

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1.5rem 1.25rem;
  margin-top: 1rem;
  width: 100%;
  background-color: var(--game-green);
  border-radius: 9999px;
  border: 1px solid var(--game-gold);
  
  & > div:first-child {
    color: var(--header-color);
    font-family: "Noto Sans SC";
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.375rem;
  }
`;

const BattleSetting = styled.div`
  width: 17rem;
  margin-top : 2.5rem;
  margin-bottom: 4rem;
  
  & > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2.5rem;

    & > div {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      border-radius: 0.5rem;
      border: 1px solid #777;


      & > div:first-child {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #121212;
        font-family: "Noto Sans SC";
        font-size: 1.125rem;
        font-style: normal;
        font-weight: 500;
        line-height: 2rem; 
        background: var(--Game-gold, linear-gradient(90deg, #8F6B29 0%, #FDE08D 50%, #DF9F28 100%));
        padding: 0.25rem;
      }

      & > div:last-child {

        & > div {
          display: flex;
          padding: 1rem;
          justify-content: space-between;
          align-items: center;
        }

        & > div:first-child {
          border-bottom: 1px solid #777;
        }

      }
    }
  }

  & > div:last-child {
    margin-bottom: 0;

    & > span {
      top : -0.675rem;
    }
  }
`;

const ContentHeader = styled.div`
    color: var(--game-gold);
    font-family: "Noto Sans SC";
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 500;
    line-height: 2rem;
`;

const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: var(--font-color);
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 2rem;

  & > svg {
    margin-left: 1rem;
    width: 1.25rem;
    height: 1.25rem;

    path {
      fill: var(--gray);
    }
  }
`;

export default GameHub;
