import { useFetcher, useLoaderData } from '@remix-run/react';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgClose from '~/components/icons/close';
import GameHeader from '~/components/section/game-header';

import LotteryModal from './lottery-modal';
import type { loader } from './server';

export { action, loader, meta  } from './server';

const Lottery = () => {
  const { t } = useTranslation('game-hub');

  const { lotteries } = useLoaderData<typeof loader>();

  const fetcher : any = useFetcher();

  const [lotteryItemsOpen, setLotteryItemsOpen] = useState<{ [key: number]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lotteryAmount, setLotteryAmount] = useState('0');

  const [lotteryDays, setLotteryDays] = useState([
    0,
    0,
    0,
    0,
  ]);

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

  const quantifyLotteries = useMemo(() => {
    const lotteryData = Array.from({ length: 12 }).map((_, i) => ({
      month: i + 1,
      quantity: 0,
    }));

    lotteries.forEach((lottery: { month: any }) => {
      const level = lottery.month;
      lotteryData[level - 1].quantity++;
    });

    return lotteryData;
  }, [lotteries]);

  const toggleLottery = (index: number) => {
    setLotteryItemsOpen(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const drawing = ( month : number ) => {
    const filteredLotteries =
      lotteries.filter((lottery: { month: number; }) => lottery.month === month);

    if (filteredLotteries.length === 0) {
      return alert('No lottery available');
    }

    const lottery_ids = filteredLotteries[0];

    fetcher.submit({ lottery_ids: JSON.stringify(lottery_ids) }, { method: 'POST' });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle') {
      setLotteryAmount(fetcher.data.prizeAmount);
      setLotteryDays(fetcher.data.delayDays);
      setIsModalOpen(true);
    }
  }, [fetcher]);

  return (
    <Wrapper>
      <GameHeader border>
        {t('等级选择')}
      </GameHeader>
      <LotteryWrapper>
        {monthlyNames.map((name, index) => (
          <>
            <LotteryButton
              key={name}
              onClick={() => toggleLottery(index)}
            >
              {name}
            </LotteryButton>
            {lotteryItemsOpen[index] && (
              <LotteryItemWrapper>
                <LotteryItemHeader>
                  {t('祝你好运！')}
                </LotteryItemHeader>
                <LotteryImageWrapper>
                  <img
                    src="/images/lottery.png"
                    alt="lottery"
                  />
                  <SvgClose />
                  <div>{quantifyLotteries[index].quantity}</div>
                </LotteryImageWrapper>
                <BasicButton
                  onClick={() => drawing(index + 1)}
                >
                  {t('打开')}
                </BasicButton>
              </LotteryItemWrapper>
            )}
          </>
        ))}
      </LotteryWrapper>
      <LotteryModal
        isModalOpen={isModalOpen}
        toggleModal={handleModalClose}
        days={lotteryDays}
        amount={Number(formatEther(lotteryAmount))}
      />
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
  width: 100%;
  background-color: var(--reward-bg2);
`;

const LotteryWrapper = styled.div`
  display: flex;
  flex-direction: column; 
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  margin-top: 1.5rem;
`;

const LotteryButton = styled.button`
  width: 100%;
  border: 1px solid var(--game-gold);
  background: linear-gradient(90deg, #597CF6 0%, #613795 100%);
  border-radius: 9999px;
  color: var(--font-color);
  font-family: "Noto Sans SC";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 2rem; 
  text-align: center;
`;

const LotteryItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  padding: 0 1.25rem;
  width: 100%;
`;

const LotteryItemHeader = styled.div`
  color: #EFEFEF;
  font-family: "Noto Sans SC";
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const LotteryImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;

  & > img {
    flex : 1;
    width: auto;
    height: auto;
    min-width: 0;
  }

  & > svg{
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;

    path {
      fill: var(--main-color);
    }
  }

  & > div {
    flex-shrink: 0;
    color: var(--font-color);
    font-family: "Noto Sans SC";
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem; 
  }
`;

export default Lottery;
