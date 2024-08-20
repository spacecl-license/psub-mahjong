import { useFetcher, useLoaderData } from '@remix-run/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import PsubInput from '~/components/input/psub-input';
import QuantityInput from '~/components/input/quantity-input';
import SelectInput from '~/components/input/select-input';
import BasicSection from '~/components/section/basic-section';
import type Reward from '~/models/reward';
import { getNft, toComma } from '~/utils/utils';

import type { QuantifyReward } from './route';
import type { loader } from './server';

export { loader, meta } from './server';

type SwapProps = {
  rewards: Reward[];
  quantifyRewards: QuantifyReward[];
  selectedReward: QuantifyReward;
  onRewardClick: (quantifyReward: QuantifyReward) => void;
};

const Swap: React.FC<SwapProps> = ({
  rewards,
  quantifyRewards,
  selectedReward,
  onRewardClick,
}) => {
  const TokensOption = [{ value: 'psub', label: 'PSUB' }];
  const { t } = useTranslation('my-reward');
  const [quantity, setQuantity] = useState('0');
  const fetcher = useFetcher();

  const { coinPrice } = useLoaderData<typeof loader>();

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

  // const bonusData = useMemo(() => {
  //   const bonusRates = [
  //     '0',
  //     '0.2',
  //     '0.3',
  //     '0.5',
  //     '1',
  //     '2',
  //     '10',
  //   ];
  //   let results: any[] = [];

  //   const quantities = selectedReward.quantitiesByBonusRate || {};

  //   bonusRates.forEach(rate => {
  //     const count = quantities[rate] || 0;

  //     if (count > 0) {
  //       results.push({
  //         value: (Number(rate) * 100).toString(),
  //         label: `${Number(rate) * 100}%`,
  //       });
  //     }
  //   });

  //   return results;
  // }, [selectedReward]);

  // const [bonus, setBonus] = useState<string>(bonusData[0]?.value ?? '0');
  // const [maxQuantity, setMaxQuantity] = useState<number>(selectedReward.quantitiesByBonusRate['0'] ?? 0);
  const [maxQuantity, setMaxQuantity] = useState<number>(selectedReward.quantity);

  // useEffect(() => {
  //   setBonus(bonusData[0]?.value ?? '0');
  // }, [bonusData]);

  useEffect(() => {
    // setMaxQuantity(selectedReward.quantitiesByBonusRate[parseFloat(bonus) / 100] ?? 0);
    setMaxQuantity(selectedReward.quantity);
  }, [
    // bonus,
    selectedReward,
    // bonusData,
  ]);

  const psubAmount = useMemo(() => {
    const nft = getNft(selectedReward?.month ?? 1);
    const price = nft!.price.PsuB;
    const amount = parseFloat(quantity) * price / 2;

    // if (bonus === undefined) {
    //   return amount;
    // }
    // const bonusAmount = amount + amount * (parseInt(bonus ?? '0') / 100);
    return amount;
  }, [
    quantity, selectedReward,
    // bonus,
  ]);

  const handleRewardChange = (value: string) => {
    onRewardClick(quantifyRewards[parseInt(value) - 1]);
    setQuantity('0');
  };

  // const handleBonusChange = (value: string) => {
  //   setBonus(value);
  //   const bonusRate = parseFloat(value) / 100;
  //   const bonusQuantity = selectedReward.quantitiesByBonusRate[bonusRate.toString()] || 0;
  //   setMaxQuantity(bonusQuantity);
  //   setQuantity('0');
  // };

  const rewardOptions = useMemo(() => {
    return quantifyRewards.map(quantifyReward => ({
      label: monthlyNames[quantifyReward.month - 1],
      value: quantifyReward.month.toString(),
    }));
  }, [quantifyRewards]);

  const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputQuantity = parseFloat(e.target.value);

    if (inputQuantity > maxQuantity) {
      setQuantity(maxQuantity.toString());
    } else {
      setQuantity(inputQuantity.toString());
    }
  };

  // const swap = () => {
  //   const reward_ids: any[] = [];
  //   const isZeroBonus = bonus === '0';
  //   const bonusRate = isZeroBonus ? '0' : (parseFloat(bonus ?? '0') / 100).toString();

  //   const filteredRewards = rewards.filter(reward => {
  //     return reward.level === selectedReward.month &&
  //       (isZeroBonus ? !reward.bonusRate || reward.bonusRate.toString() === '0' : reward.bonusRate?.toString() === bonusRate);
  //   });

  //   for (let i = 0; i < parseInt(quantity); i++) {
  //     if (filteredRewards[i]) {
  //       reward_ids.push(filteredRewards[i]._id);
  //     }
  //   }

  //   if (reward_ids.length > 0) {
  //     fetcher.submit({ reward_ids: JSON.stringify(reward_ids), bonusRate  }, { method: 'POST' });
  //   } else {
  //     alert('Requested quantity exceeds available rewards for the selected bonus rate.');
  //   }
  // };
  const swap = () => {
    const reward_ids: any[] = [];
    const filteredRewards = rewards.filter(reward => reward.level === selectedReward.month);

    for (let i = 0; i < parseInt(quantity); i++) {
      reward_ids.push(filteredRewards[i]._id!);
    }

    fetcher.submit({ reward_ids: JSON.stringify(reward_ids) }, { method: 'POST' });
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if ((fetcher.data as any).error) {
        alert((fetcher.data as any).error);
      } else {
        alert('Reward swapped.');
      }
    }
  }, [fetcher]);

  return (
    <Wrapper>
      <ExchangeWrapper>
        <img
          src={selectedReward?.image ?? '/images/1.png'}
          alt={`reward${selectedReward?.month ?? '1'}`}
        />
        <ExchangeDetail>
          <SelectInput
            label={t('奖励_')}
            options={rewardOptions}
            selectedValue={((selectedReward?.month ?? 1)).toString()}
            onChange={handleRewardChange}
          />
          {/* <SelectInput
            label={t('奖金')}
            options={bonusData}
            spanContent={t('只能选择您持有的项目。')}
            selectedValue={bonus}
            onChange={handleBonusChange}
          /> */}
          <QuantityInput
            label={t('数量')}
            spanContent={`${t('最多可交换')} ${maxQuantity?? '0'}${t('个_')}`}
            currency="EA"
            onChange={onQuantityChange}
            value={quantity}
          />
        </ExchangeDetail>
      </ExchangeWrapper>
      {/* <QuantityWrapper>
        <QuantityInput
          label={t('数量')}
          spanContent={`Up to ${maxQuantity?? '0'} EA swap able`}
          currency="EA"
          onChange={onQuantityChange}
          value={quantity}
        />
      </QuantityWrapper> */}
      <BasicSection headerContent={t('销售代币的数量')}>
        <ReceiveWrapper>
          <SelectInput
            label={t('代币')}
            options={TokensOption}
          />
          <PsubInput
            label={t('数量')}
            value={toComma(psubAmount)}
            usdEquivalent={Number((coinPrice.USD * psubAmount).toFixed(2))}
            yenEquivalent={Number((coinPrice.CNY * psubAmount).toFixed(2))}
          />
          <BasicButton
            onClick={swap}
            disabled={(quantity === '0')}
          >
            {t('销售')}
          </BasicButton>
        </ReceiveWrapper>
      </BasicSection>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
`;

const ExchangeWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1.5rem;
  padding: 1.25rem;

  & > img {
    width: 6.25rem;
    height: 10rem;
    flex-shrink: 0;
  }
`;

const ExchangeDetail = styled.div`
  width: 100%; 
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  padding-top: 0.4rem;

  & >div > div > div > select {
    height: 2.5rem;
    text-align: right;
    white-space: nowrap;
    font-family: "Noto Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem;
    text-transform: uppercase;
    padding-right: 3.5rem ;
  }

  & > div > div > div > svg {
    width: 1.25rem;
    height: 1.25rem;
  }

`;

const ReceiveWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem;

  & > div > div > select {
    height: 2.5rem;
    white-space: nowrap;
    font-family: "Noto Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem;
    text-transform: uppercase;
    padding-right: 3.5rem ;
  }

  & > div > div > svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

// const QuantityWrapper = styled.div`
//   width: 100%;
//   padding: 1rem 1.25rem;
// `;

export default Swap;
