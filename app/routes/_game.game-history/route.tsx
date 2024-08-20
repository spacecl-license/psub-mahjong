import { useFetcher, useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import { formatEther } from 'ethers/lib/utils';
import {
  useCallback,
  useDeferredValue, useEffect, useMemo,
  useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { BasicTab } from '~/components/tab/basic-tab';
import useObserver from '~/hooks/use-observer';
import { formatDate } from '~/utils/date';
import { getNft } from '~/utils/utils';

import type { loader } from './server';

export { action, loader, meta } from './server';

const GameHistory = () => {
  const {
    history, randomBox, lottery,
  } = useLoaderData<typeof loader>();
  const { t } = useTranslation('game-hub');

  const [historyState, setHistoryState] = useState(history);
  const [lotteryState, setLotteryState] = useState(lottery);
  const fetcher : any = useFetcher();
  const historyPage = useRef(1);
  const lotteryPage = useRef(1);
  const deferredHistory = useDeferredValue(historyState);
  const deferredLottery = useDeferredValue(lotteryState);

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

  const [activeTab, setActiveTab] = useState('GAME');

  const handleLoadHistory = useCallback(() => {
    historyPage.current = historyPage.current + 1;

    if (fetcher.state !== 'loading' && fetcher.state !== 'submitting') {
      fetcher.submit({ page : historyPage.current, type : 'history' }, { method: 'post' });
    }
  }, [historyPage]);

  const handleLoadLottery = useCallback(() => {
    lotteryPage.current = lotteryPage.current + 1;

    if (fetcher.state !== 'loading' && fetcher.state !== 'submitting') {
      fetcher.submit({ page : lotteryPage.current, type : 'lottery' }, { method: 'post' });
    }
  }, [lotteryPage]);

  useEffect(() => {
    const data = fetcher.data;

    if (fetcher.state === 'idle' && data && data.history) {
      setHistoryState((current : any) => [...current, ...data.history]);
    }

    if (fetcher.state === 'idle' && data && data.lottery) {
      setLotteryState((current : any) => [...current, ...data.lottery]);
    }
  }, [fetcher]);

  const HistoryItem = useMemo(() => {
    return deferredHistory.map((data : any, i : number) => {
      const playerIndex = data.players.findIndex((player: any) =>
        player.box.toString() === randomBox._id.toString(),
      );
      const nft = getNft(data.month);
      const price = nft!.price.PsuB;
      const amount = price / 2;
      const winnerAmount = formatEther(data.prizeAmount);
      const isWinner = data.winnerPlayer?.box._id === randomBox._id;

      const transferTime = dayjs(data.reservedTransfer.transferTime);
      const today = dayjs();
      const daysUntilTransfer = transferTime.diff(today, 'day');
      let dayLabel = `D - ${daysUntilTransfer}`;

      if (daysUntilTransfer < 0) {
        dayLabel = 'Received';
      } else if (daysUntilTransfer === 0) {
        dayLabel = 'D-day';
      }

      return (
        <HistoryWrapper key={i}>
          <GroupWrapper>
            <ResultGroup>
              <label>{isWinner ? t('胜') : t('败')}</label>
            </ResultGroup>
            <BonusGroup>
              {isWinner ?
                (
                  <label>
                    {winnerAmount && `${Number(winnerAmount)} PsuB`}
                  </label>
                )
                :
                (
                  <label>
                    {amount && `- ${amount + (amount * data.players[playerIndex].rewardRate)} PsuB`}
                  </label>
                )}
            </BonusGroup>
          </GroupWrapper>
          <GroupWrapper2>
            <Date>{formatDate(data.createdAt, 'YYYY.MM.DD HH:mm')}</Date>
            {isWinner ? (
              <VsGroup>
                {daysUntilTransfer > 0 ? (
                  <label>Receive Day</label>
                ) : (<label />)}
                <p>{dayLabel}</p>
              </VsGroup>
            ) : (<VsGroup />)}
          </GroupWrapper2>
        </HistoryWrapper>
      );
    });
  }, [
    deferredHistory,
    t,
    activeTab,
  ]);

  const LotteryItem = useMemo(() => {
    return deferredLottery.map((data : any, i : number) => (

      <HistoryWrapper key={i} >
        <GroupWrapper>
          <ResultGroup>
            <label>LOTTERY</label>
          </ResultGroup>
          <BonusGroup>
            <label>
              {monthlyNames[data.month - 1]}
            </label>
          </BonusGroup>
        </GroupWrapper>
        <GroupWrapper2>
          <Date>{formatDate(data.createdAt, 'YYYY.MM.DD HH:mm')}</Date>
          <VsGroup>
            <label>From</label>
            <p>{data.benefactor?.user?.id}</p>
          </VsGroup>
        </GroupWrapper2>
      </HistoryWrapper>
    ));
  }, [
    deferredLottery,
    t,
    activeTab,
  ]);

  const { observerTarget } = useObserver(HistoryItem, () => {
    handleLoadHistory();
  });

  const { observerTarget: observerTarget2 } = useObserver(LotteryItem, () => {
    handleLoadLottery();
  });

  return (
    <Wrapper>
      <BasicTab
        firstTabTitle="GAME"
        secondTabTitle="LOTTERY"
        firstTabValue="GAME"
        secondTabValue="LOTTERY"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === 'GAME' && (
        <>
          {HistoryItem}
          {historyState.length > 9 && (
            <div ref={observerTarget} />
          )}
        </>
      )}
      {activeTab === 'LOTTERY' &&  (
        <>
          {LotteryItem}
          {lotteryState.length > 9  && (
            <div ref={observerTarget2} />
          )}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const HistoryWrapper = styled.div`
  width: 100%;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--border-bottom-color);
  background-color: var(--reward-bg2);
  display: flex;
  justify-content: space-between;
  align-items: stretch;
`;

const GroupWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
`;

const GroupWrapper2 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-direction: column;
`;

const ResultGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;

  & > label {
    overflow: hidden;
    color: var(--font-color);
    text-overflow: ellipsis;
    font-family: "Noto Sans SC";
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1rem;
    text-transform: uppercase;
  }
`;

const Date = styled.p`
  color: var(--receipt-date-color);
  text-align: right;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
`;

const BonusGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.31rem;

  & > label {
    color: var(--dark-sub2);
    font-family: "Noto Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1rem;
  }
`;

// const StackGroup = styled.div`
//   display: flex;
//   align-items: flex-start;
//   & > label {
//     color:  #CDCDCD;
//     font-family: "Noto Sans SC";
//     font-size: 0.875rem;
//     font-style: normal;
//     font-weight: 400;
//     line-height: 0.875rem;
//   }

// `;

const VsGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.31rem;

  & > label {
    color: var(--dark-sub);
    text-align: center;
    font-family: "Noto Sans";
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  & > p {
    overflow: hidden;
    color: var(--font-color);
    text-overflow: ellipsis;
    font-family: "Noto Sans";
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

export default GameHistory;
