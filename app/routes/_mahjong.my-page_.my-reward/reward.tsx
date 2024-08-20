import { useLoaderData } from '@remix-run/react';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import PsubInput from '~/components/input/psub-input';
import RewardItem from '~/components/items/reward';
import { toComma } from '~/utils/utils';

import RewardModal from './reward-modal';
import type { QuantifyReward } from './route';
import type { loader } from './server';

export { loader, meta } from './server';

type RewardProps = {
  quantifyRewards: QuantifyReward[];
  onRewardClick: (quantifyReward: QuantifyReward) => void;
  selectedReward: QuantifyReward;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const RewardPage: React.FC<RewardProps> = ({
  quantifyRewards, onRewardClick, selectedReward, isModalOpen, setIsModalOpen,
}) => {

  const { coinPrice } = useLoaderData<typeof loader>();

  const totalAmount = useMemo(() => {
    const total = quantifyRewards.reduce((sum, { quantity, price }) => {
      return sum + quantity * price;
    }, 0);

    return total;
  }, [quantifyRewards]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <NFTWrapper>
      <PsubInput
        value={toComma(totalAmount)}
        label="TOTAL PSUB REWARD"
        usdEquivalent={Number((coinPrice.USD * totalAmount).toFixed(2))}
        yenEquivalent={Number((coinPrice.CNY * totalAmount).toFixed(2))}
      />
      {quantifyRewards.map(quantifyReward => (
        <RewardItem
          key={quantifyReward.month}
          src={`/images/${quantifyReward.month}.png`}
          alt={`${quantifyReward.month}月`}
          month={quantifyReward.month}
          quantity={quantifyReward.quantity}
          onClick={() => onRewardClick(quantifyReward)}
          name={quantifyReward.name}
        />
      ))}
      {isModalOpen && (
        <RewardModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          selectedReward={selectedReward}
        />
      )}
    </NFTWrapper>
  );
};

const NFTWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
`;

export default RewardPage;
