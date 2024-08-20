import { useFetcher } from '@remix-run/react';
import clsx from 'clsx';
import type { ObjectId } from 'mongoose';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { GAME_STATUS } from '~/common/constants';
import { debounce } from '~/components/debounce/debounce';
import SvgHistory from '~/components/icons/history';
import SvgProcess from '~/components/icons/process';
import GameItem from '~/components/items/game-item';
import { useTheme } from '~/hooks/use-theme';
// import type Game from '~/models/game';
import type GameV2 from '~/models/game-v2';

type Tab = 'ONGOING' | 'HISTORY';

interface Props {
  // ongoingGames: Game[];
  // rewardedGames: Game[];
  ongoingGames: GameV2[];
  rewardedGames: GameV2[];
}

// 메인 컴포넌트
const GameCalendar = ({
  ongoingGames,
  rewardedGames,
}: Props) => {
  const { t } = useTranslation('game');
  const [activeTab, setActiveTab] = useState<Tab>('ONGOING');
  const [notExpandedMonths, setNotExpandedMonths] = useState<{ [key: number]: boolean }>({});
  const fetcher = useFetcher();
  const [isLoading, setIsLoading] = useState(false);

  const [theme] = useTheme();

  const toggleMonth = (index: number) => {
    setNotExpandedMonths(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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

  const monthlyOngoingGames = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const month = monthlyNames[i];
      const g = ongoingGames.filter(game => game.level === i + 1);

      // * 기존 룰 게임 스티커
      // const games = g.map((game, i) => {
      //   let maxActiveItems = 0;
      //   if (game.left) maxActiveItems++;
      //   if (game.right) maxActiveItems++;
      //   if ((game.left as Game)?.left) maxActiveItems++;
      //   if ((game.left as Game)?.right) maxActiveItems++;
      //   if ((game.right as Game)?.left) maxActiveItems++;
      //   if ((game.right as Game)?.right) maxActiveItems++;

      //   return {
      //     ...game,
      //     maxActiveItems,
      //   };
      // });

      // * 신규 룰 게임 스티커
      const games = g.map((game, i) => {
        let maxActiveItems = game.children.length;
        return {
          ...game,
          maxActiveItems,
        };
      });

      return {
        month,
        games,
      };
    });
  }, [ongoingGames]);

  const monthlyRewardedGames = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const month = monthlyNames[i];
      const g = rewardedGames.filter(game => game.level === i + 1);

      const games = g.map((game, i) => {
        let maxActiveItems = 6;
        return {
          ...game,
          maxActiveItems,
        };
      });

      return {
        month,
        games,
      };
    });
  }, [rewardedGames]);

  const reward = (game_id: ObjectId | string) => {
    setIsLoading(true);
    fetcher.submit({ game_id: game_id.toString() }, { method: 'POST' });
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setIsLoading(false);

      if ((fetcher.data as any).error) {
        alert((fetcher.data as any).error);
      } else {
        alert('Reward received.');
      }
    }
  }, [fetcher]);

  return (
    <Container
      className={clsx(['calendar'])}
    >
      <Tabs>
        <TabButton
          active={activeTab === 'ONGOING'}
          onClick={() => setActiveTab('ONGOING')}
        >
          <SvgProcess />
          {t('进行中')}
        </TabButton>
        <TabButton
          active={activeTab === 'HISTORY'}
          onClick={() => setActiveTab('HISTORY')}
        >
          <SvgHistory />
          {t('记录')}
        </TabButton>
      </Tabs>
      {activeTab === 'ONGOING' && (
        <>
          {monthlyOngoingGames.map((month, monthIndex) => (
            <MonthSection key={monthIndex}>
              <MonthTitle onClick={() => toggleMonth(monthIndex)}>{month.month}</MonthTitle>
              {!notExpandedMonths[monthIndex] && (
                <>
                  {month.games.map((game, gameIndex) => (
                    <GameWrapper
                      key={gameIndex}
                      theme={theme}
                    >
                      <div>
                        {`GAME ${game.round}`}
                        {game.status === GAME_STATUS.ENDED ? (
                          <RewardButton
                            onClick={() => debounce<any>(reward(game._id!), 300)}
                            disabled={isLoading}
                          >
                            {t('完成')}
                          </RewardButton>
                        ) : (
                          <ProgressButton>{t('进行中_')}</ProgressButton>
                        )}
                      </div>
                      <ItemContainer>
                        {[...Array(6)].map((_, index) => {
                          const isActive = index < game.maxActiveItems;
                          return (
                            <GameItem
                              key={index}
                              isActive={isActive}
                              index={index}
                            />
                          );
                        })}
                      </ItemContainer>
                    </GameWrapper>
                  ))}
                </>
              )}
            </MonthSection>
          ))}
        </>
      )}
      {activeTab === 'HISTORY' && (
        <>
          {monthlyRewardedGames.map((month, monthIndex) => (
            <MonthSection key={monthIndex}>
              <MonthTitle onClick={() => toggleMonth(monthIndex)}>{month.month}</MonthTitle>
              {!notExpandedMonths[monthIndex] && (
                <>
                  {month.games.map((game, gameIndex) => (
                    <GameWrapper
                      key={gameIndex}
                      theme={theme}
                    >
                      <div>
                        {`GAME ${game.round}`}
                      </div>
                      <ItemContainer>
                        {[...Array(6)].map((_, index) => {
                          const isActive = index < game.maxActiveItems;
                          return (
                            <GameItem
                              key={index}
                              isActive={isActive}
                              index={index}
                            />
                          );
                        })}
                      </ItemContainer>
                    </GameWrapper>
                  ))}
                </>
              )}
            </MonthSection>
          ))}
        </>
      )}
    </Container>
  );
};

// 스타일 컴포넌트들
const Container = styled.div`
  background-color: var(--main-color);
  color: white;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 0 1.25rem;
  height: 100%;
  padding-bottom: 1.9rem;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  width: 100vw;
  margin-left: -1.25rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => active ? 'transparent' : 'var(--bg-color)'};
  color: ${({ active }) => active ? 'var(--calendar-color)' : 'var(--calendar-tap-color)'};
  width: 50%;
  padding: 0.62rem 0;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: none;
  gap: 0.62rem;
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    path {
      fill: ${({ active }) => active ? 'var(--calendar-color)' : 'var(--calendar-tap-color)'};
    }
  }

  &:focus {
    outline: none;
  }
`;

const MonthSection = styled.section`
  margin-bottom: 0;
`;

const MonthTitle = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  background-color: var(--bg-color);
  color: var(--calendar-color2);
  font-family: Inter;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2.5rem;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-bottom-color);
  margin-left: -1.25rem;
`;

const GameWrapper = styled.div<{theme : string}>`
  background: rgba(0, 0, 0, 0.20);
  padding: 1rem;
  border: ${({ theme }) => theme === 'dark' ? 'none' : '1px solid var(--sub-color4)'};
  margin: 1.25rem 0;

  & > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 0.5rem;
    color: #FFF;
    text-align: center;
    font-family: Montserrat;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
    text-transform: uppercase;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const RewardButton = styled.button`
  background-color: var(--calendar-color);
  color: var(--sub-color);
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; 
  text-transform: uppercase;
  border: none;
  border-radius: 9999px;
  padding: 0 0.5rem;
  cursor: pointer;
  white-space: nowrap;
`;

const ProgressButton = styled.div`
  background: rgba(0, 0, 0, 0.20);
  border: 1px solid var(--badge-color);
  color: var(--badge-color);
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; 
  text-transform: uppercase;
  border-radius: 9999px;
  padding: 0 0.5rem;
  cursor: pointer;
  text-align: center;
`;

export default GameCalendar;
