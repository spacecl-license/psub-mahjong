import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import ChannelItem from '~/components/items/channel-item';
import GameHeader from '~/components/section/game-header';

import type { QuantifyRandomBox } from './route';

interface ChannelProps {
  quantifyRandomBox: QuantifyRandomBox[];
  setMonthly: React.Dispatch<React.SetStateAction<number>>;
  setChannelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Channel: React.FC<ChannelProps> = ({
  quantifyRandomBox, setMonthly, setChannelOpen,
}) => {
  const { t } = useTranslation('game-hub');

  return (
    <Wrapper>
      <GameHeader border>
        {t('频道选择')}
      </GameHeader>
      <ChannelItemWrapper>
        {quantifyRandomBox.map((reward, index) => (
          <ChannelItem
            key={reward.month}
            title={reward.name}
            imageSrc={reward.image}
            isActive={reward.quantity > 0}
            onClick={() => {
              if (reward.quantity === 0) return;
              setMonthly(reward.month);
              setChannelOpen(false);
            }}
          />
        ))}
      </ChannelItemWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  color: var(--font-color);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const ChannelItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  gap: 1.5rem;
  width: 100%;
`;

export default Channel;
